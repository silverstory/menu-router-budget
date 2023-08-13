import { Form } from "react-router-dom";

// library
import { UserPlusIcon } from "@heroicons/react/24/solid";

// assets
import illustration from "../assets/illustration.jpg";

const Intro = () => {
  return (
    <div className="intro">
      <div>
        <h1>
          Create+<span className="accent">Recipe</span>
        </h1>
        <p>Design in one place. Start here by signing in.</p>
        <Form method="post">
          <input
            type="email"
            name="email"
            required
            placeholder="Enter your email"
            aria-label="Email"
            autoComplete="given-name"
          />
          <input
            type="password"
            name="password"
            required
            placeholder="Enter your password"
            aria-label="Password"
          />
          <input type="hidden" name="_action" value="newUser" />
          <button type="submit" className="btn btn--dark">
            <span>Sign in</span>
            <UserPlusIcon width={20} />
          </button>
        </Form>
      </div>
      <img src={illustration} alt="Kitchen" width={600} />
    </div>
  );
};
export default Intro;
