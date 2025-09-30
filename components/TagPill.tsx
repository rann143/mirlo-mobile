import { Link, useRouter } from "expo-router";

type TagPillProps = {
  key: number;
  tagName: string;
};

export default function TagPill({ tagName }: TagPillProps) {
  const router = useRouter();
  return (
    <Link
      href={{
        pathname: "/tags/[tag]",
        params: { tag: tagName },
      }}
      style={{
        backgroundColor: "#f0f0f0",
        borderWidth: 1,
        borderColor: "#e3e1e1",
        padding: 10,
        paddingHorizontal: 15,
        borderRadius: 18,
        marginRight: 5,
        marginVertical: 5,
      }}
      onPress={() => router.back()}
    >
      {tagName}
    </Link>
  );
}
