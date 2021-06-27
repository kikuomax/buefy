import { createApp, h as createElement } from 'vue'

import Toast from './Toast'

import config from '../../utils/config'
import { merge, getComponentFromVNode } from '../../utils/helpers'
import { use, registerComponentProgrammatic } from '../../utils/plugins'

const ToastProgrammatic = {
    open(params) {
        if (typeof params === 'string') {
            params = {
                message: params
            }
        }

        const defaultParam = {
            position: config.defaultToastPosition || 'is-top'
        }
        if (params.parent) {
            delete params.parent
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
                    toastVNode: null
                }
            },
            methods: {
                close() {
                    const toast = getComponentFromVNode(this.toastVNode)
                    if (toast) {
                        toast.close()
                    }
                }
            },
            render() {
                this.toastVNode = createElement(
                    Toast,
                    {
                        ...propsData,
                        // On Vue 3, $destroy is no longer available.
                        // A toast has to be unmounted manually.
                        onClose: () => {
                            if (typeof propsData.onClose === 'function') {
                                propsData.onClose()
                            }
                            // timeout for the animation complete
                            // before unmounting
                            setTimeout(() => {
                                vueInstance.unmount()
                            }, 150)
                        }
                    },
                    slot != null ? { default: () => slot } : undefined
                )
                // we are interested in `toastVNode.component` but
                // at this point `toastVNode.component` should be null
                return this.toastVNode
            }
        })
        return vueInstance.mount(container)
    }
}

const Plugin = {
    install(Vue) {
        registerComponentProgrammatic(Vue, 'toast', ToastProgrammatic)
    }
}

use(Plugin)

export default Plugin

export {
    ToastProgrammatic,
    Toast as BToast
}
