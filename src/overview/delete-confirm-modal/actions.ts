import { createAction } from 'redux-act'

import { remoteFunction } from '../../util/webextensionRPC'
import analytics from '../../analytics'
import { Thunk } from '../../options/types'
import * as selectors from './selectors'
import { acts as resultsActs } from '../results'
import { actions as searchFilterActs } from '../../search-filters'
import { EVENT_NAMES } from '../../analytics/internal/constants'

export const show = createAction<{ url: string; index: number }>(
    'deleteConf/show',
    (url, index) => ({ url, index }),
)
export const hide = createAction('deleteConf/hide')
export const reset = createAction('deleteConf/reset')
export const resetDeleteIndex = createAction('deleteConf/resetDeleteIndex')

const processEventRPC = remoteFunction('processEvent')
const deletePagesRPC = remoteFunction('delPages')
const createNotifRPC = remoteFunction('createNotification')

export const deleteDocs: () => Thunk = () => async (dispatch, getState) => {
    const url = selectors.urlToDelete(getState())

    analytics.trackEvent({
        category: 'Overview',
        action: 'Delete result',
    })

    processEventRPC({
        type: EVENT_NAMES.DELETE_RESULT,
    })

    try {
        dispatch(hide())

        // Remove all assoc. docs from the database + index
        await deletePagesRPC([url])

        dispatch(resultsActs.hideResultItem(url))
    } catch (err) {
        createNotifRPC({
            requireInteraction: false,
            title: 'Memex error: deleting page',
            message: err.message,
        })
    }
    dispatch(searchFilterActs.removeTagFromFilter())
    dispatch(resetDeleteIndex())
}
