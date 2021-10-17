import { getAuthFramework, loginData } from "./config";

describe("login", () => {
  test("success", async () => {
    const $auth = getAuthFramework();

    await $auth.login(
      loginData,
      (data) => data.auth.token,
      (data) => data.user
    );

    expect($auth.state.loggingIn).toBe(false);
    expect($auth.state.on).toBe(true);
  });

  test("fail", async () => {
    const $auth = getAuthFramework();

    try {
      await $auth.login(
        {
          email: loginData.email,
          password: "",
        },
        (data) => data.auth.token,
        (data) => data.user
      );
    } catch {
      expect($auth.state.loggingIn).toBe(false);
      expect($auth.state.on).toBe(false);
    }
  });

  test("try to login while logged in", async () => {
    const $auth = getAuthFramework();
    const login = () => {
      return $auth.login(
        loginData,
        (data) => data.auth.token,
        (data) => data.user
      );
    };

    await login();

    await expect(login()).rejects.toThrow("O usuário já está on.");

    expect($auth.state.loggingIn).toBe(false);
    expect($auth.state.on).toBe(true);
  });
});

describe("check", () => {
  test("checking after login", async () => {
    localStorage.clear();
    let $auth = getAuthFramework();

    await $auth.login(
      loginData,
      (data) => data.auth.token,
      (data) => data.user
    );

    await expect($auth.check()).rejects.toThrow("O usuário já está on.");

    $auth = getAuthFramework();

    await $auth.check();

    expect($auth.state.checking).toBe(false);
    expect($auth.state.on).toBe(true);
  });

  test("checking after logout", async () => {
    localStorage.clear();
    const $auth = getAuthFramework();

    await $auth.check();

    expect($auth.state.checking).toBe(false);
    expect($auth.state.on).toBe(false);
  });
});

describe("logout", () => {
  test("try to logout while logged in", async () => {
    const $auth = getAuthFramework();

    await $auth.login(
      loginData,
      (data) => data.auth.token,
      (data) => data.user
    );

    await $auth.logout();

    expect($auth.state.loggingOut).toBe(false);
    expect($auth.state.on).toBe(false);
  });

  test("try to logout while logged out", async () => {
    const $auth = getAuthFramework();

    await expect($auth.logout()).rejects.toThrow("O usuário já está off.");

    expect($auth.state.loggingOut).toBe(false);
    expect($auth.state.on).toBe(false);
  });
});
