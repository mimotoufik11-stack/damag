export interface Project {
  id: string;
  name: string;
  description?: string;
  settings: ProjectSettings;
  metadata?: ProjectMetadata;
  createdAt: string;
  lastModified: string;
}

export interface ProjectSettings {
  resolution: string;
  frameRate: number;
  duration: number;
  backgroundColor?: string;
}

export interface ProjectMetadata {
  author?: string;
  tags?: string[];
  version?: number;
  thumbnailTimestamp?: number;
}

export interface ProjectCreateInput {
  name: string;
  description?: string;
  settings?: Partial<ProjectSettings>;
}

export interface ProjectUpdateInput {
  name?: string;
  description?: string;
  settings?: Partial<ProjectSettings>;
  metadata?: Partial<ProjectMetadata>;
}
