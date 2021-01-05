class ScrollView extends PureComponent {
  state = {
    // This actually lives within redux for me, but this list will be updated as the user navigates through chatbot
    chatItems: [
      {
        message: 'Hello, this is bot',
      },
      {
        message: 'I am here to help you',
      },
    ],
  }

  renderChatItems = (item, index, chatList) => {
    return <ChatItem chatEntry={item} key={index} isLastItem={(chatList.length - 1) === index} />
  }

  render() {
    return (
      <ScrollView>{this.state.chatItems.map(this.renderChatItems)}</ScrollView>
    )
  }
}

class ChatItem extends PureComponent {
  avatarOpacityAnimatedValue = new Animated.Value(Number(this.props.isLastItem))

  componentWillReceiveProps(nextProps) {
    if (this.props.isLastItem !== nextProps.isLastItem) {
      // I want to animate the component hidden without rerendering
      Animated.timing(this.avatarOpacityAnimatedValue, {
        toValue: Number(nextProps.isLastItem),
        duration: 300,
      }).start()
    }
  }

  shouldComponentUpdate = () => false

  render() {
    return (
      <View>
        <Animated.View style={{ opacity: this.avatarOpacityAnimatedValue }}>
          <Avatar />
        </Animated.View>
      </View>
    )
  }
}
