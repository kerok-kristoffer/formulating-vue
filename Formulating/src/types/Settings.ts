// Formulating/src/types/Settings.ts
import Cookies from 'js-cookie';
import Units from './Units';

export default class Settings {
  preferredUnits: Units;
  debug: boolean;
  printSettings: {
    showInciList: boolean;
    showNotes: boolean;
    showInstructions: boolean;
  };

  constructor() {
    this.preferredUnits = Cookies.get('preferredUnits') as Units || 'g';
    this.debug = false;
    this.printSettings = {
      showInciList: true,
      showNotes: true,
      showInstructions: true,
    };
  }

  save() {
    Cookies.set('preferredUnits', this.preferredUnits);
    Cookies.set('printSettings', JSON.stringify(this.printSettings));
  }

  load() {
    this.preferredUnits = Cookies.get('preferredUnits') as Units || 'g';
    const printSettings = Cookies.get('printSettings');
    if (printSettings) {
      this.printSettings = JSON.parse(printSettings);
    }
  }
}