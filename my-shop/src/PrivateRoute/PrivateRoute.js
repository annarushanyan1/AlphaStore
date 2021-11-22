import {
    Route,
    Redirect
} from 'react-router-dom';

function PrivateRoute({ children, isAuthenticated, ...rest }) {
    console.log(isAuthenticated);
    console.log(rest);

    if (rest["path"] === "/login" || rest["path"] === "/registration") {
        console.log("iinnnn")
        if (!isAuthenticated) {
            return (<Route
                {...rest}
                render={
                    ({ location }) => (<Redirect
                        to={{
                            pathname: '/',
                            state: { from: location }
                        }}
                    />
                    )

                }
            />
            )
        }
    }
    return (
        <Route
            {...rest}
            render={
                ({ location }) => (
                    isAuthenticated
                        ? (
                            children
                        ) : (
                            <Redirect
                                to={{
                                    pathname: '/forbidden',
                                    state: { from: location }
                                }}
                            />
                        ))
            }
        />
    );
}

export default PrivateRoute;