import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import SpotsBrowser from "./components/SpotsBroswer/SpotsBrowser";
import SpotDetails from "./components/SpotDetails/SpotDetails";
import CreateSpot from "./components/CreateSpot/CreateSpot";
import PostReview from "./components/PostReview/PostReview";
import ManageSpots from "./components/ManageSpots/ManageSpots";
import DeleteForm from "./components/DeleteForm/DeleteForm";
import UpdateForm from "./components/UpdateForm/UpdateForm";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route path="/login">
            <LoginFormPage />
          </Route>
          <Route path="/signup">
            <SignupFormPage />
          </Route>
          <Route path="/spots/:spotId/reviews">
            <PostReview />
          </Route>
          <Route exact path="/spots/current">
            <ManageSpots />
          </Route>
          <Route path="/spots/:spotId/delete">
            <DeleteForm />
          </Route>
          <Route path="/spots/:spotId/update">
            <UpdateForm />
          </Route>
          <Route path="/spots/:spotId">
            <SpotDetails />
          </Route>
          <Route path="/spots">
            <CreateSpot />
          </Route>
          <Route exact path="/">
            <SpotsBrowser />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
