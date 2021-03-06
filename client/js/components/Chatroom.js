import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Login from './Login';

import Spinner from './Spinner';
import { fetchMessages, sendMessage } from '../ducks/messages';
import { loginUser } from '../ducks/user';

class Chatroom extends React.Component {
    static propTypes = {
        messages: PropTypes.shape({
            message: PropTypes.string,
            id: PropTypes.string,
        }).isRequired,
        user: PropTypes.shape({
            email: PropTypes.string,
            displayName: PropTypes.string,
            uid: PropTypes.string,
        }).isRequired,
        isLoading: PropTypes.bool.isRequired,
        isAuthorized: PropTypes.bool.isRequired,
        onFetch: PropTypes.func.isRequired,
        onSend: PropTypes.func.isRequired,
        onLogin: PropTypes.func.isRequired,
    };

    state = {
        messageInputValue: '',
    }

    componentDidMount() {
        this.props.onFetch();
    }

    setMessageValue = e => this.setState({ messageInputValue: e.target.value });

    scrollToBottom = () => {
        const el = this.messagesEnd;
        if (el) el.scrollIntoView();
    };

    sendMessage = (e) => {
        const { messageInputValue } = this.state;
        e.preventDefault();

        if (messageInputValue.replace(/\s/g, '').length) { // if string has a length after replacing all the whitespace, post it
            this.props.onSend(messageInputValue, this.props.user);
            this.setState({ messageInputValue: '' });
        }
    };

    login = (values) => {
        const { email, password } = values;
        return this.props.onLogin(email, password);
    };

    renderMessages = (messages) => {
        this.scrollToBottom();
        return (
            <div className="conversation">
                {
                    Object.keys(messages).map(key => (
                        messages[key].uid === this.props.user.uid ?
                            <div className="messages messages--sent" key={key}>
                                <div className="message">{messages[key].message}</div>
                            </div>
                            : <div className="messages messages--received" key={key}>
                                <span
                                    className="messages--received__avatar"
                                    style={{ background: messages[key].hue }}
                                >
                                    {messages[key].displayName ? messages[key].displayName.charAt(0) : '?'}
                                </span>
                                <div className="message">{messages[key].message}</div>
                            </div>
                    ))
                }
                <div
                    ref={(el) => {
                        this.messagesEnd = el;
                    }}
                    style={{ marginTop: '90px' }}
                />
                <form onSubmit={this.sendMessage} className="conversation__actions">
                    <input
                        type="text"
                        onChange={this.setMessageValue}
                        value={this.state.messageInputValue}
                        className="conversation__actions-msg"
                        placeholder="Type..."
                    />
                    {this.state.messageInputValue !== '' ?
                        <button type="submit">
                            <i className="icon icon--arrow" />
                        </button> : ''}
                </form>
            </div>
        );
    };

    render() {
        if (this.props.isLoading && this.props.isAuthorized) {
            return (
                <Spinner />
            );
        } else if (!this.props.isAuthorized && !this.props.isLoading) {
            return (
                <Login onSubmit={this.login} />
            );
        } else if (this.props.isAuthorized) {
            return (
                this.renderMessages(this.props.messages)
            );
        }
    }
}

const mapStateToProps = state => ({
    messages: state.messages.messages,
    user: state.user.user,
    isLoading: state.messages.isLoading,
    isAuthorized: state.user.isAuthorized,
});

const mapDispatchToProps = dispatch => ({
    onFetch: () => dispatch(fetchMessages()),
    onSend: (message, user) => dispatch(sendMessage(message, user)),
    onLogin: (username, password) => dispatch(loginUser(username, password)),
});

const MessagesConnector = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Chatroom);

export default MessagesConnector;
