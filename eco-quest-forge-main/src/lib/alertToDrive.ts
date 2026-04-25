export type DriveTypeOption =
  | "plantation"
  | "cleanup"
  | "river-cleaning"
  | "awareness";

/** Payload passed from Eco-Alerts → Community Drives create flow */
export interface OrganizeDrivePayload {
  alertId: string;
  title: string;
  description: string;
  location: string;
  driveType: DriveTypeOption;
  suggestedActions: string[];
}

type AlertLike = {
  id: string;
  type: string;
  title: string;
  message: string;
  location: string;
  actions: { title: string; description: string }[];
  collectiveImpact: { description: string };
};

export function mapAlertTypeToDriveType(alertType: string): DriveTypeOption {
  switch (alertType) {
    case "water":
      return "river-cleaning";
    case "festival":
    case "plastic":
      return "cleanup";
    case "disaster":
    case "wildlife":
      return "plantation";
    case "air":
    case "heat":
    case "pollution":
    default:
      return "awareness";
  }
}

export function buildOrganizeDrivePayload(alert: AlertLike): OrganizeDrivePayload {
  const driveType = mapAlertTypeToDriveType(alert.type);
  const baseTitle = alert.title.replace(/!+$/, "").trim();
  const fromActions = alert.actions.map(
    (a) => `${a.title} — ${a.description}`
  );

  const extrasByType: Record<string, string[]> = {
    air: [
      "Organize a tree-planting event in your school or colony",
      "Run a “no crackers / low-smoke” awareness campaign during high AQI days",
      "Start a school-wide carpooling or cycle-to-school challenge",
    ],
    water: [
      "Host a riverbank or drain cleanup with classmates",
      "Run a water conservation pledge week at school",
    ],
    festival: [
      "Promote clay idols and natural colors in your community",
      "Arrange a POP-free idol collection / awareness stall",
    ],
    disaster: [
      "Coordinate native tree planting to reduce flood risk",
      "Workshop on rainwater harvesting for neighbors",
    ],
    pollution: [
      "Anti–single-use plastic week at school",
      "Community awareness walk on reducing emissions",
    ],
  };

  const extras = extrasByType[alert.type] ?? [
    "Host an awareness session at school",
    "Plan a weekend cleanup or plantation with peers",
  ];

  const suggestedActions = [...fromActions];
  for (const line of extras) {
    if (!suggestedActions.includes(line)) suggestedActions.push(line);
  }

  const description = [
    alert.message,
    "",
    alert.collectiveImpact.description,
    "",
    "You’re organizing a student-led community drive to turn this alert into collective action. Add date, time, and meeting place so classmates can join.",
  ].join("\n");

  return {
    alertId: alert.id,
    title: `Community Drive: ${baseTitle}`,
    description,
    location: alert.location,
    driveType,
    suggestedActions: suggestedActions.slice(0, 8),
  };
}

const STORAGE_KEY = "ecolearn_alert_linked_drives";

export type LinkedDriveInfo = {
  driveTitle: string;
  createdAt: string;
};

export function getLinkedDrivesByAlert(): Record<string, LinkedDriveInfo> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, LinkedDriveInfo>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function linkDriveToAlert(alertId: string, driveTitle: string): void {
  try {
    const prev = getLinkedDrivesByAlert();
    prev[alertId] = { driveTitle, createdAt: new Date().toISOString() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prev));
  } catch {
    /* ignore */
  }
}
