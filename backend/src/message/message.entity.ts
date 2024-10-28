export type MessageCompositeKey = `${string}/${string}`;

export type Message = {
  channelId: string;
  timestamp: number;
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

export const decodeFromCompositeKey = (compositeKey: string) => {
  const [postUserId, timestamp] = compositeKey.split("/");
  if (!timestamp || !postUserId)
    throw new Error("意図しないcompositeKeyです", { cause: { compositeKey } });
  return {
    postUserId,
    timestamp: parseFloat(timestamp),
  };
};

export const encodeToCompositeKey = (
  message: Pick<Message, "postUserId" | "timestamp">
) => {
  return message.postUserId + "/" + message.timestamp;
};
