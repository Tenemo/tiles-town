import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as appActions from '../actions/appActions';
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import ContactPage from './contact/ContactPage';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEnvelope, faBuilding } from '@fortawesome/free-regular-svg-icons';
import { faMoon, faTrophy, faArrowRight, faUniversity, faHashtag } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
library.add(
    faMoon,
    faTrophy,
    faArrowRight,
    faEnvelope,
    faGithub,
    faLinkedin,
    faBuilding,
    faUniversity,
    faHashtag
);
import toastr from 'toastr';
toastr.options = {
    closeButton: true,
    closeDuration: 0,
    timeOut: 0,
    extendedTimeOut: 0,
    positionClass: 'toast-top-left'
};
import Header from './common/Header';
import GamePage from './game/GamePage';

const scrollUp = () => {
    window.scrollTo(0, 0);
    return null;
};

export class App extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.changeTheme = this.changeTheme.bind(this);
    // }
    componentDidMount() {
        document.body.className = this.props.app.theme;
    }
    changeTheme = (event) => {
        if (event.target.checked) {
            Promise.resolve(this.props.actions.changeTheme('theme-dark')).then(() => {
                document.body.className = this.props.app.theme;
            });
        } else {
            Promise.resolve(this.props.actions.changeTheme('theme-light')).then(() => {
                document.body.className = this.props.app.theme;
            });
        }
    }
    render() {
        return (
            <div>
                <Header loading={this.props.loading} changeTheme={this.changeTheme} darkTheme={this.props.app.darkTheme} />
                <div className="container-fluid main-container">
                    <Route path="/" component={scrollUp} />
                    <Switch>
                        <Route path="/about" component={ContactPage} />
                        <Route path="/flip-tiles" component={GamePage} />
                        <Route render={() => <Redirect push to="/flip-tiles"/>} />
                    </Switch>
                </div>
            </div>
        );
    }
}

App.propTypes = {
    app: PropTypes.object,
    actions: PropTypes.object.isRequired,
    loading: PropTypes.bool
};

function mapStateToProps(state) {
    return {
        app: state.app,
        loading: state.ajaxCallsInProgress > 0
    };
}
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(appActions, dispatch)
    };
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
)(App));