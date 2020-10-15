import testHelper, { TestFlowsItem } from "node-red-node-test-helper";
import erSensorObservationNode from "../nodes/er-sensor-observation/er-sensor-observation";
import { ErSensorObservationNodeDef } from "../nodes/er-sensor-observation/modules/types";

type FlowsItem = TestFlowsItem<ErSensorObservationNodeDef>;
type Flows = Array<FlowsItem>;

describe("er-sensor-observation node", () => {
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
        type: "er-sensor-observation",
        name: "er-sensor-observation",
      },
    ];
    testHelper.load(erSensorObservationNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("er-sensor-observation");
      done();
    });
  });
});
