import { createApp, h as createElement } from 'vue'

import Notification from './Notification'
import NotificationNotice from './NotificationNotice'

import config from '../../utils/config'
import { merge } from '../../utils/helpers'
import { use, registerComponent, registerComponentProgrammatic } from '../../utils/plugins'

const NotificationProgrammatic = {
    open(params) {
        if (typeof params === 'string') {
            params = {
                message: params
            }
        }

        const defaultParam = {
            position: config.defaultNotificationPosition || 'is-top-right'
        }
        if (params.parent) {
            delete params.parent
        }
        let onClose
        if (typeof params.onClose === 'function') {
            onClose = params.onClose
            delete params.onClose
        }
        let slot
        if (Array.isArray(params.message)) {
            slot = params.message
            delete params.message
        }
        const propsData = merge(defaultParam, params)
        const container = document.createElement('div')
        const vueInstance = createApp({
            data() {
                return {
                    noticeVNode: null
                }
            },
            methods: {
                close() {
                    const notice =
                        this.noticeVNode?.component?.expose ||
                        this.noticeVNode?.component?.proxy
                    notice?.close()
                }
            },
            render() {
                this.noticeVNode = createElement(
                    NotificationNotice,
                    {
                        ...propsData,
                        onClose: () => {
                            if (onClose != null) {
                                onClose()
                            }
                            // waits for a while in favor of animation
                            setTimeout(() => {
                                vueInstance.unmount()
                            }, 150)
                        }
                    },
                    slot != null ? { default: () => slot } : undefined
                )
                return this.noticeVNode
            }
        })
        return vueInstance.mount(container)
    }
}

const Plugin = {
    install(Vue) {
        registerComponent(Vue, Notification)
        registerComponentProgrammatic(Vue, 'notification', NotificationProgrammatic)
    }
}

use(Plugin)

export default Plugin

export {
    NotificationProgrammatic,
    Notification as BNotification
}
