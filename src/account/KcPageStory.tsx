import type { DeepPartial } from "keycloakify/tools/DeepPartial";
import type { KcContext } from "./KcContext";
import { createGetKcContextMock } from "keycloakify/account/KcContext";
import type { KcContextExtension, KcContextExtensionPerPage } from "./KcContext";
import KcPage from "./KcPage";
import { themeNames, kcEnvDefaults } from "../kc.gen";

const kcContextExtension: KcContextExtension = {
    themeName: themeNames[0],
    properties: {
        ...kcEnvDefaults
    }
};
const kcContextExtensionPerPage: KcContextExtensionPerPage = {};

const overridesPerPage = {
    "applications.ftl": {
        stateChecker: "storybook-state-checker",
        applications: {
            applications: [
                {
                    realmRolesAvailable: [],
                    resourceRolesAvailable: {},
                    additionalGrants: [],
                    clientScopesGranted: ["profile", "email"],
                    client: {
                        id: "storybook-app-id",
                        clientId: "storybook-app",
                        name: "Storybook Application",
                        consentRequired: true
                    }
                }
            ]
        }
    }
} satisfies Parameters<typeof createGetKcContextMock<KcContextExtension, KcContextExtensionPerPage>>[0]["overridesPerPage"];

export const { getKcContextMock } = createGetKcContextMock({
    kcContextExtension,
    kcContextExtensionPerPage,
    overrides: {},
    overridesPerPage
});

export function createKcPageStory<PageId extends KcContext["pageId"]>(params: { pageId: PageId }) {
    const { pageId } = params;

    function KcPageStory(props: { kcContext?: DeepPartial<Extract<KcContext, { pageId: PageId }>> }) {
        const { kcContext: overrides } = props;

        const kcContextMock = getKcContextMock({
            pageId,
            overrides
        });

        return <KcPage kcContext={kcContextMock} />;
    }

    return { KcPageStory };
}
