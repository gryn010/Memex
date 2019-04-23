import { browser, Notifications } from 'webextension-polyfill-ts'
import { makeRemotelyCallable } from 'src/util/webextensionRPC'
import browserIsChrome from './check-browser'
export const DEF_ICON_URL = '/img/worldbrain-logo-narrow.png'
export const DEF_TYPE = 'basic'

// Chrome allows some extra notif opts that the standard web ext API doesn't support
export interface NotifOpts extends Notifications.CreateNotificationOptions {
    [chromeKeys: string]: any
}

const onClickListeners = new Map<string, (id: string) => void>()

browser.notifications.onClicked.addListener(id => {
    browser.notifications.clear(id)

    const listener = onClickListeners.get(id)
    listener(id)
    onClickListeners.delete(id) // Manually clean up ref
})

/**
 * Firefox supports only a subset of notif options. If you pass unknowns, it throws Errors.
 * So filter them down if browser is FF, else nah.
 */
function filterOpts({
    type,
    iconUrl,
    requireInteraction,
    title,
    message,
    ...rest
}: NotifOpts): NotifOpts {
    const opts = { type, iconUrl, requireInteraction, title, message }
    return !browserIsChrome() ? opts : { ...opts, ...rest }
}

async function createNotification(
    notifOptions: Partial<NotifOpts>,
    onClick = f => f,
) {
    const id = await browser.notifications.create(
        filterOpts({
            type: DEF_TYPE,
            iconUrl: DEF_ICON_URL,
            requireInteraction: true,
            ...(notifOptions as NotifOpts),
        }),
    )

    onClickListeners.set(id, onClick)
}

export default createNotification

makeRemotelyCallable({ createNotification })
