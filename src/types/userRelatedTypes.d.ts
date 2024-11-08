declare module "userRelatedTypes" {
  export interface User {
    _id: string;
    created_at: Date;
    email: string;
    iconpath: string;
    nickname: string;
    notifications: Notification[];
    teams: Teams[];
    comments: string[];
  }

  export interface Notification {
    _id: string;
    created_at: Date;
    type: string;
    requestUser?: string;
    content: string;
    isRead: boolean;
    team: Teams | null;
  }

  export interface OwnedFolder {
    _id: string;
    created_at: string;
    visibleTo: string;
    name: string;
    files: string[];
    subFolders: string[];
    ownerTeam: string[];
  }

  export interface FileVersion {
    _id: string;
    versionNumber: number;
    file: OwnedFiles;
  }

  export interface OwnedFiles {
    _id: string;
    created_at: Date;
    visibleTo: string;
    uploadUser: string;
    type: string;
    size: string;
    s3key: string;
    ownerTeam: string;
    name: string;
    filePath: string;
    versions: FileVersion[];
    comments: CommentsInFile[];
  }

  export interface Members {
    user: User;
    role: string;
    _id: string;
  }

  export interface JoinRequests {
    _id: string;
    user: User;
  }

  export interface Teams {
    _id: string;
    created_at: Date;
    joinRequests: JoinRequests[];
    leader: string;
    members: Members[];
    name: string;
    ownedFiles: OwnedFiles[];
    ownedFolders: OwnedFolder[];
  }

  export interface CommentsInFile {
    _id: string;
    content: string;
    created_at: Date;
    fileId: string;
    user: User;
  }
}
