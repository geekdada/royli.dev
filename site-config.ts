import { SiteConfig } from './lib/types'

const config: SiteConfig = {
  defaultPageCover:
    'https://images.unsplash.com/photo-1538474705339-e87de81450e8?ixlib=rb-1.2.1&q=80&auto=format&cs=srgb&ixid=MnwzNjMyMnwwfDF8c2VhcmNofDF8fHBpcGV8ZW58MHx8fHwxNjU0MzcxMDkx&crop=entropy&w=1920',
  contentDatabaseId: 'a6f23fd9c4fb4fbca6808e785c30eae0',
  pagesDatabaseId: '47ec000e50324439bfb40ece0ae3f72c',
  tagsDatabaseId: 'fa1148dfb38043fb9c34f090770be7e6',
  // resourceProxyServer: 'http://0.0.0.0:8000',
  resourceProxyServer: 'https://resource-proxy.royli.dev',
}

export default config
