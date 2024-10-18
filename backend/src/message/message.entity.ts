export type MessageCompositeKey = `${string}/${string}`;

export type Message = {
  channelId: string;
  timestamp: string;
  channelName: string;
  message: string;
  postedDate: Date;
  postUserId: string;
  postUserName: string;
  postUserImageUrl: string | null;
  blownDate: Date;
  blowUserId: string;
  blowUserName: string;
};
export const decodeFromCompositeKey = (compositeKey: MessageCompositeKey) => {
  const [postUserId, timestamp] = compositeKey.split("/");
  return {
    postUserId,
    timestamp,
  };
};
