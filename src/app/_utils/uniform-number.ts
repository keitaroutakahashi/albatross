/** 背番号つきの表示名。背番号が無い（助っ人）場合は名前だけにする */
export const formatMemberLabel = (member: {
  uniformNumber: string | null;
  name: string;
}): string =>
  member.uniformNumber
    ? `#${member.uniformNumber} ${member.name}`
    : member.name;
