import "../../src/styles.css";
import "../../src/course-discovery.css";
import { IconRuntime } from "../_components/site/IconRuntime";

export default function PublicSiteLayout({ children }) {
  return (
    <>
      {children}
      <IconRuntime />
    </>
  );
}
