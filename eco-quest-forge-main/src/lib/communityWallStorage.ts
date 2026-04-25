/** Extra Community Wall posts persisted in localStorage (e.g. from Share → teacher → wall). */

export type WallPostCategory =
  | "tree-planting"
  | "recycling"
  | "energy-saving"
  | "water-conservation"
  | "other";

export interface StoredWallPost {
  _id: string;
  title: string;
  description: string;
  category: WallPostCategory;
  author: string;
  image: {
    filename: string;
    path: string;
    mimetype: string;
    size: number;
  };
  imageUrl: string;
  likes: number;
  comments: Array<{
    _id: string;
    author: string;
    text: string;
    createdAt: string;
  }>;
  status: "approved";
  ecoPoints: number;
  createdAt: string;
  updatedAt: string;
}

const KEY = "ecolearn_community_wall_extra";

export function getExtraWallPosts(): StoredWallPost[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredWallPost[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendExtraWallPost(post: StoredWallPost): void {
  try {
    const next = [post, ...getExtraWallPosts()];
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota or private mode */
  }
}
