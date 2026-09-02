export interface NavItem {
  /** Element id on the page, without the leading hash. */
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
