import {
  Callout,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Grid,
  H1,
  H2,
  H3,
  Link,
  Pill,
  Row,
  Stack,
  Stat,
  Table,
  Text,
} from "./ui.js";

const SNAPSHOT = "9 Sep 2026";

/** Realistic fixture: same surfaces as a Cursor-style landscape canvas. */
export function LandscapeDemo() {
  return (
    <Stack gap={20} style={{ padding: 24, maxWidth: 880, width: "100%", boxSizing: "border-box" }}>
      <H1>MicroVM landscape</H1>
      <Text tone="secondary">
        Snapshot {SNAPSHOT}. Isolation products, not a ranking.
      </Text>
      <Callout tone="info" title="A microVM is a small virtual machine">
        Docker&apos;s default isolation is namespaces plus cgroups. A microVM
        adds a guest kernel.
      </Callout>
      <Row gap={24} wrap>
        <Stat value="5" label="VMMs in scope" />
        <Stat value="Kata 4.1" label="OCI runtime still shipping" />
        <Stat value="2018" label="Firecracker public" tone="info" />
      </Row>
      <H2>Hypervisors that stay small</H2>
      <Table
        striped
        stickyHeader
        headers={["Project", "License", "Latest", "Stars"]}
        rows={[
          ["Firecracker", "Apache-2.0", "v1.12.1", "31.7k"],
          ["Cloud Hypervisor", "Apache-2.0 / BSD-3", "v48.0.0", "5.4k"],
          ["libkrun", "Apache-2.0", "v1.16.0", "2.7k"],
        ]}
        columnAlign={["left", "left", "left", "right"]}
      />
      <H2>Nearby, not a microVM</H2>
      <Grid columns="1.2fr 1fr" gap={16}>
        <Stack gap={12}>
          <H3>gVisor</H3>
          <Text>
            Userspace kernel. Intercepts syscalls. Not a guest OS. 用户态内核,
            不是虚拟机.
          </Text>
        </Stack>
        <Card>
          <CardHeader>Shared foundation</CardHeader>
          <CardBody>
            <Text tone="secondary">rust-vmm is crates, not a product.</Text>
          </CardBody>
        </Card>
      </Grid>
      <Divider />
      <Row gap={8} wrap>
        <Pill size="sm">
          <Link href="https://firecracker-microvm.github.io/">Firecracker</Link>
        </Pill>
        <Pill size="sm">
          <Link href="https://www.cloudhypervisor.org/">Cloud Hypervisor</Link>
        </Pill>
      </Row>
    </Stack>
  );
}
