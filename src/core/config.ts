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
}

export {ForgeConfig};

