const BYTE_UNITS = 'KMGTPEZY';

export function toArray(data: any) {
    return Array.isArray(data) ? data : (data ? [data] : [])
}

export function removeToArray(object: object, key: string) {
    const result = toArray(object[key])
    delete object[key]
    return result
}

export function parseHumanReadableBytes(size_str: string) {
    if (!size_str.length)
        return

    const size_str_upper = size_str.toUpperCase()

    if (size_str_upper.at(-1) === 'B') {
        const unit = size_str_upper.at(-2)

        if (unit === undefined)
            return

        // @ts-ignore
        if (unit < 10) // a digit part of byte value
            return +size_str.slice(0, -1)

        const unit_index = BYTE_UNITS.indexOf(unit)
        return (unit_index > -1) ? parseByUnitIndex(unit_index, size_str.slice(0, -2)) : undefined
    }

    const unit = size_str_upper.at(-1)

    // @ts-ignore
    if (unit < 10) // a digit part of byte value
        return +size_str

    const unit_index = BYTE_UNITS.indexOf(unit!)

    return (unit_index > -1) ? parseByUnitIndex(unit_index, size_str.slice(0, -1)) : undefined

    function parseByUnitIndex(index, value) {
        value = parseFloat(value)
        return value * Math.pow(1024, 1 + index)
    }
}

export function getClientMaxBodySize(config: object) {
    if (typeof config.cached.http_client_max_body_size === undefined) {
        const max = config.http.client_max_body_size
        config.cached.http_client_max_body_size = parseHumanReadableBytes(max) || '';
        return max ? cached.http_client_max_body_size : undefined
    }
    return config.cached.http_client_max_body_size || undefined
}

export function getMaxWorker(config: object) {
    if (config.worker_processes === 'auto')
        return navigator.hardwareConcurrency
    return parseInt(config.worker_processes) || 0
}
