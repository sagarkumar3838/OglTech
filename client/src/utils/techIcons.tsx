// Tech Icons from https://devicon.dev/
// This utility provides Devicon classes for various technologies

export interface TechIcon {
  name: string;
  iconClass: string;
}

// Map technology names to their Devicon class names
const deviconMap: Record<string, string> = {
  // Web Development
  html: 'html5',
  html5: 'html5',
  css: 'css3',
  css3: 'css3',
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  react: 'react',
  reactjs: 'react',
  angular: 'angularjs',
  vue: 'vuejs',
  vuejs: 'vuejs',
  
  // Backend
  java: 'java',
  python: 'python',
  nodejs: 'nodejs',
  node: 'nodejs',
  csharp: 'csharp',
  'c#': 'csharp',
  php: 'php',
  ruby: 'ruby',
  go: 'go',
  golang: 'go',
  rust: 'rust',
  
  // Database
  sql: 'mysql',
  mysql: 'mysql',
  oracle: 'oracle',
  postgresql: 'postgresql',
  postgres: 'postgresql',
  mongodb: 'mongodb',
  mongo: 'mongodb',
  redis: 'redis',
  
  // Mobile
  kotlin: 'kotlin',
  swift: 'swift',
  flutter: 'flutter',
  reactnative: 'react',
  
  // DevOps & Cloud
  docker: 'docker',
  kubernetes: 'kubernetes',
  k8s: 'kubernetes',
  linux: 'linux',
  aws: 'amazonwebservices',
  amazon: 'amazonwebservices',
  azure: 'azure',
  gcp: 'googlecloud',
  google: 'googlecloud',
  terraform: 'terraform',
  ansible: 'ansible',
  
  // Graphics & Game Dev
  opengl: 'opengl',
  glsl: 'opengl',
  cpp: 'cplusplus',
  'c++': 'cplusplus',
  unity: 'unity',
  unreal: 'unrealengine',
  
  // DevTools
  devtools: 'chrome',
  chrome: 'chrome',
  webpack: 'webpack',
  git: 'git',
  vscode: 'vscode',
  
  // Testing
  selenium: 'selenium',
  jest: 'jest',
  cypress: 'cypressio',
};

/**
 * Get the Devicon class name for a technology
 * @param techName - The technology name (e.g., 'javascript', 'react')
 * @param variant - Icon variant: 'plain' | 'original' | 'line' (default: 'plain')
 * @param colored - Whether to use colored version (default: true)
 * @returns The Devicon class name
 */
export function getDeviconClass(
  techName: string, 
  variant: 'plain' | 'original' | 'line' = 'plain',
  colored: boolean = true
): string {
  const iconName = deviconMap[techName.toLowerCase()] || techName.toLowerCase();
  const colorSuffix = colored ? '-colored' : '';
  return `devicon-${iconName}-${variant}${colorSuffix}`;
}

/**
 * React component for rendering a Devicon tech icon
 */
interface TechIconProps {
  name: string;
  variant?: 'plain' | 'original' | 'line';
  colored?: boolean;
  size?: number;
  className?: string;
}

export function TechIcon({ 
  name, 
  variant = 'plain', 
  colored = true, 
  size = 24, 
  className = '' 
}: TechIconProps) {
  const iconClass = getDeviconClass(name, variant, colored);
  
  return (
    <i 
      className={`${iconClass} ${className}`}
      style={{ fontSize: `${size}px` }}
      title={name}
    />
  );
}
