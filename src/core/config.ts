interface ForgeConfig {
    project: {
        name: string;
        language: string;
    };
    checks: {
        [key: string]: {
            [tool: string]: boolean;
        };
    };
    autofix: {
        enabled: boolean;
    };
    pattern: string[];
    ignore: string[];
}

export {ForgeConfig};

