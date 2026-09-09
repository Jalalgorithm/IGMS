export interface NavLink {
  /** Element id on the page, without the leading hash. */
  readonly targetId: string;
  readonly label: string;
}

export interface NavGroup {
  /** Stable id used to wire the trigger to its menu for assistive tech. */
  readonly id: string;
  readonly label: string;
  /**
   * Where the group's own label points, when the group corresponds to a real
   * section. Omitted for groups that only exist to gather links together.
   */
  readonly targetId?: string;
  readonly children: readonly NavLink[];
}

export type NavEntry = NavLink | NavGroup;

export const isNavGroup = (entry: NavEntry): entry is NavGroup => 'children' in entry;

/** Retained for the footer and the mobile menu, which render a flat list. */
export interface NavItem {
  readonly targetId: string;
  readonly label: string;
}

export interface FocusArea {
  readonly targetId: string;
  readonly label: string;
  readonly summary: string;
  readonly image: string;
  readonly alt: string;
}

export interface PathwayCard {
  readonly name: string;
  readonly audience: string;
}
