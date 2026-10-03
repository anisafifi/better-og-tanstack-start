import handler from "@tanstack/react-start/server-entry";

export default {
    fetch: async (request: Request, env: Env,) => {
        const url = new URL(request.url)
        const prefix = "/og"
        if (url.pathname.startsWith(prefix)) {
            url.pathname = url.pathname.slice(prefix.length) || "/"
            request = new Request(url.toString(), request)
        }
        return handler.fetch(request, env)
    },
};