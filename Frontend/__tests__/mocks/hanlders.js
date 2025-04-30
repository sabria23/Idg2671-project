import { rest } from 'msw';

export const handlers = [
    rest.post('/api/studies', (req, res, ctx) =>{
        return res(ctx.status(201), ctx.json({ id: 123}));
    }),
];