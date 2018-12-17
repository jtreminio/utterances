interface AppSettings {
  node_env: string;
  app_root: string;
  utterances_api: string;
  github_app_name: string;
  google_analytics?: string;
}

const settings: AppSettings = {
  node_env: process.env.NODE_ENV ? process.env.NODE_ENV : 'dev',
  app_root: process.env.APP_ROOT as string,
  utterances_api: process.env.UTTERANCES_API as string,
  github_app_name: process.env.GITHUB_APP_NAME as string,
  google_analytics: process.env.GOOGLE_ANALYTICS,
};

if (!settings.app_root || !settings.utterances_api) {
  throw new Error('Missing app settings.');
}

export {
    settings,
};
