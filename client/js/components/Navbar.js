import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { fetchMessages } from '../ducks/messages';
import { logUserOut } from "../ducks/user";

class Navbar extends React.Component {
    static propTypes = {
        user: PropTypes.shape({
            displayName: PropTypes.string,
        }).isRequired,
        onLogout: PropTypes.func.isRequired,
        onFetch: PropTypes.func.isRequired,
        isAuthorized: PropTypes.bool.isRequired,
    };

    componentDidMount() {
        this.props.onFetch();
    }

    render() {
        return (
            <div className="navbar__container">
                <nav className="navbar navbar-default">
                    {this.props.isAuthorized ?
                        <span className="navbar-username">{this.props.user.displayName}</span>
                        : ''
                    }
                    <span className="navbar-app">Bloomfield</span>
                    {this.props.isAuthorized ?
                        <button className="navbar-btn" onClick={() => this.props.onLogout()}>Log out</button>
                        : ''
                    }
                </nav>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    isAuthorized: state.user.isAuthorized,
});

const mapDispatchToProps = dispatch => ({
    onFetch: () => dispatch(fetchMessages()),
    onLogout: () => dispatch(logUserOut()),
});

const NavbarConnector = connect(
    mapStateToProps,
    mapDispatchToProps,
)(Navbar);

export default NavbarConnector;
