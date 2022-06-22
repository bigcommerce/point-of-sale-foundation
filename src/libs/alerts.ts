export interface IAlertManager {
  clear(): void;
  add(alert: any): void;
}

class DummyAlertManager implements IAlertManager {
  clear(): void {
    console.debug("alert manager clear");
  }
  add(alert: any): void {
    console.debug(`alert manager add: ${alert}`);
  }
}

const alertManager = new DummyAlertManager();

export default alertManager;
