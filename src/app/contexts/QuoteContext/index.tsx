import { contextFactory } from '../ContextFactory';

import { type QuoteState, type Action, INITIAL_STATE } from './reducer';

export const { useSelector, Context, useDispatch } = contextFactory<
    QuoteState,
    Action
>(INITIAL_STATE);
