
export const loggerMiddleware = async (ctx, next) => {
    console.log("Raw update:", JSON.stringify(ctx.update, null, 2));
    await next();
};