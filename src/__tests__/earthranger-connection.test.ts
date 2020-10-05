import testHelper, { TestFlowsItem } from "node-red-node-test-helper";
import earthrangerConnectionNode from "../nodes/earthranger-connection/earthranger-connection";
import { EarthrangerConnectionNodeDef } from "../nodes/earthranger-connection/modules/types";

type FlowsItem = TestFlowsItem<EarthrangerConnectionNodeDef>;
type Flows = Array<FlowsItem>;

describe("earthranger-connection node", () => {
  beforeEach((done) => {
    testHelper.startServer(done);
  });

  afterEach((done) => {
    testHelper.unload().then(() => {
      testHelper.stopServer(done);
    });
  });

  it("should be loaded", (done) => {
    const flows: Flows = [
      {
        id: "n1",
        type: "earthranger-connection",
        name: "earthranger-connection",
      },
    ];
    testHelper.load(earthrangerConnectionNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("earthranger-connection");
      done();
    });
  });
});
