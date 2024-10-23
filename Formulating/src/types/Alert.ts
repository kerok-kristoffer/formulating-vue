import { reactive } from 'vue';

class Alert {
  state: {
    message: string;
    callback: Function;
    visible: boolean;
  };

  constructor(message: string, callback: Function) {
    this.state = reactive({
      message: message,
      callback: callback,
      visible: false,
    });
  }

  yesClick = () => {
    this.state.callback(true);
    this.state.visible = false;
  };

  noClick = () => {
    this.state.callback(false);
    this.state.visible = false;
  };

  cancelClick = () => {
    this.state.visible = false;
  };

  show() {
    this.state.visible = true;
  }
}

export default Alert;