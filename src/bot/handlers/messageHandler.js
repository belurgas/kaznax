
export const handleMessage = (ctx) => {
    if (ctx.message && 'web_app_data' in ctx.message) {
        const data = JSON.parse(ctx.message.web_app_data.data);
        console.log('Получены данные: ', data);
        // Надо придумать как можно использовать!
    }
};