export function toString(obj: any): string {
    const props: string[] = [];
    const proto = Object.getPrototypeOf(obj);

    // Include getters from prototype (excluding constructor and toString)
    for (const key of Object.getOwnPropertyNames(proto)) {
        if (key !== 'constructor' && key !== 'toString') {
            const descriptor = Object.getOwnPropertyDescriptor(proto, key);
            if (descriptor && typeof descriptor.get === 'function') {
                try {
                    props.push(`${key}: ${obj[key as keyof typeof obj]}`);
                } catch (e) {
                    props.push(`${key}: [Error: ${e}]`);
                }
            }
        }
    }

    // Also include direct properties (not from prototype)
    for (const key of Object.keys(obj)) {
        if (!props.some(line => line.startsWith(`${key}:`))) {
            props.push(`${key}: ${obj[key as keyof typeof obj]}`);
        }
    }

    return props.join('\n');
}