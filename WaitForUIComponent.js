import React, { PureComponent } from 'react';
import { InteractionManager } from 'react-native';

class WaitForUI extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      interactionsComplete: false,
    };
  }
  componentDidMount() {
    this.interactionHandle = InteractionManager.runAfterInteractions(() => {
      this.setState({ interactionsComplete: true });
      this.interactionHandle = null;
    });
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.waitIndex !== this.props.waitIndex) this.handleInteractionManager();
  }
  componentWillUnmount() {
    if (this.interactionHandle) this.interactionHandle.cancel();
  }
  componentDidUpdate(prevProps, prevState) {
    const { onRendered } = this.props;
    if (this.state.interactionsComplete && !prevState.interactionsComplete && onRendered) {
      onRendered();
    }
  }
  handleInteractionManager() {
    if (this.interactionHandle) this.interactionHandle.cancel();

    this.setState({ interactionsComplete: false });

    this.interactionHandle = InteractionManager.runAfterInteractions(() => {
      this.setState({ interactionsComplete: true });
      this.interactionHandle = null;
    });
  }
  renderLoader() {
    const { loader } = this.props;

    if (loader) return loader;

    return null
  }
  render() {
    const { interactionsComplete } = this.state;
    const { children } = this.props;

    if (interactionsComplete && children) return children;

    if (!interactionsComplete) return this.renderLoader();

    return null;
  }
}

export default WaitForUI;
