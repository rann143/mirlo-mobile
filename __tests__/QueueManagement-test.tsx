import TrackPlayer from "react-native-track-player";
import { isTrackOwnedOrPreview } from "@/scripts/utils";
import { createMockUser } from "@/__mocks__/mockUser";
import { createMockRNTrack } from "@/__mocks__/mockRNTrack";

//jest.mock("react-native-track-player");

describe("Queue Management", () => {
  test("Includes preview tracks in queue and excludes non-preview tracks", async () => {
    const previewTrack1 = createMockRNTrack({ isPreview: true, id: 1 });
    const nonPreviewTrack = createMockRNTrack({
      isPreview: false,
      id: 2,
    });
    const previewTrack2 = createMockRNTrack({ isPreview: true, id: 3 });
    const previewTrack3 = createMockRNTrack({ isPreview: true, id: 4 });

    const tracks = [
      previewTrack1,
      nonPreviewTrack,
      previewTrack2,
      previewTrack3,
    ];

    const queue = tracks.filter((track) => isTrackOwnedOrPreview(track));

    expect(queue).toHaveLength(3);
    expect(queue).toContain(previewTrack1);
    expect(queue).toContain(previewTrack2);
    expect(queue).toContain(previewTrack3);
    expect(queue).not.toContain(nonPreviewTrack);
  });
});
