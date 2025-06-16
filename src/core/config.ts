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

type QuestionType = {
    type: "input" | "list" | "checkbox";
    name: string;
    message: string;
    choices?: string[];
    default?: string[];
    // validate?: (input: string) => boolean | string;
};

export {ForgeConfig, QuestionType};

