import { TechIcon } from '../utils/techIcons';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Showcase component to display all available tech icons from Devicon
 * This can be used for testing or as a reference
 */
export function TechIconsShowcase() {
  const technologies = [
    // Web Development
    { name: 'html', label: 'HTML5' },
    { name: 'css', label: 'CSS3' },
    { name: 'javascript', label: 'JavaScript' },
    { name: 'typescript', label: 'TypeScript' },
    { name: 'react', label: 'React' },
    { name: 'angular', label: 'Angular' },
    { name: 'vue', label: 'Vue.js' },
    
    // Backend
    { name: 'java', label: 'Java' },
    { name: 'python', label: 'Python' },
    { name: 'nodejs', label: 'Node.js' },
    { name: 'csharp', label: 'C#' },
    { name: 'php', label: 'PHP' },
    { name: 'ruby', label: 'Ruby' },
    { name: 'go', label: 'Go' },
    { name: 'rust', label: 'Rust' },
    
    // Database
    { name: 'sql', label: 'SQL' },
    { name: 'oracle', label: 'Oracle' },
    { name: 'postgresql', label: 'PostgreSQL' },
    { name: 'mongodb', label: 'MongoDB' },
    { name: 'redis', label: 'Redis' },
    
    // Mobile
    { name: 'kotlin', label: 'Kotlin' },
    { name: 'swift', label: 'Swift' },
    { name: 'flutter', label: 'Flutter' },
    { name: 'reactnative', label: 'React Native' },
    
    // DevOps & Cloud
    { name: 'docker', label: 'Docker' },
    { name: 'kubernetes', label: 'Kubernetes' },
    { name: 'linux', label: 'Linux' },
    { name: 'aws', label: 'AWS' },
    { name: 'azure', label: 'Azure' },
    { name: 'gcp', label: 'Google Cloud' },
    { name: 'terraform', label: 'Terraform' },
    { name: 'ansible', label: 'Ansible' },
    
    // Graphics & Game Dev
    { name: 'opengl', label: 'OpenGL' },
    { name: 'cpp', label: 'C++' },
    { name: 'unity', label: 'Unity' },
    { name: 'unreal', label: 'Unreal Engine' },
    
    // DevTools
    { name: 'git', label: 'Git' },
    { name: 'webpack', label: 'Webpack' },
    { name: 'vscode', label: 'VS Code' },
    
    // Testing
    { name: 'selenium', label: 'Selenium' },
    { name: 'jest', label: 'Jest' },
    { name: 'cypress', label: 'Cypress' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tech Icons from Devicon</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          All technology icons used throughout the application (powered by Devicon)
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Plain Colored Icons */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Plain Colored Icons</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {technologies.map((tech) => (
                <div
                  key={`plain-${tech.name}`}
                  className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <TechIcon name={tech.name} variant="plain" colored={true} size={40} />
                  <span className="text-xs text-center font-medium">{tech.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Original Colored Icons */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Original Colored Icons</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {technologies.map((tech) => (
                <div
                  key={`original-${tech.name}`}
                  className="flex flex-col items-center gap-2 p-3 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <TechIcon name={tech.name} variant="original" colored={true} size={40} />
                  <span className="text-xs text-center font-medium">{tech.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
