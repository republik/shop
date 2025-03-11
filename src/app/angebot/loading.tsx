import { Spinner } from "@/components/ui/spinner";
import { css } from "@/theme/css";

export default function Loading() {
  return (
    <div
      className={css({
        display: "flex",
        flexGrow: 1,
        placeContent: "center",
        placeItems: "center",
      })}
    >
      <Spinner size="large" />
    </div>
  );
}
