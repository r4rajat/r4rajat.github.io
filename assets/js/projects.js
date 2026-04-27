/* Project data — single source of truth for the projects section. */
window.PORTFOLIO_PROJECTS = [
  {
    id: 'kanister',
    title: 'Kanister',
    filters: ['golang'],
    tech: ['Golang', 'Operator-go', 'Docker', 'Kubernetes', 'AWS', 'S3'],
    blurb:
      'Open-source contributions to a data-protection workflow management tool for Kubernetes.',
    body: [
      'Kanister provides a cohesive set of APIs for defining and curating data operations on Kubernetes — abstracting away the tedious details of executing them. It is extensible and easy to install, operate, and scale.',
      'Contributions include the addition of a Blueprint for CockroachDB, several Kopia-related tasks, and new functions that let users adopt Kopia as a data mover. Tested all added functionality.',
    ],
    github: 'https://github.com/kanisterio/kanister',
  },
  {
    id: 'backstore',
    title: 'Backstore',
    filters: ['golang'],
    tech: ['Golang', 'Operator-go', 'Docker', 'Kubernetes'],
    blurb:
      'A custom Kubernetes controller for backing up and restoring PVC data on demand.',
    body: [
      'Backstore is a custom Kubernetes controller written in Go. It watches for newly created Custom Resources for backup and restore operations across all namespaces.',
      'Whenever a new CR appears, the controller creates the appropriate backup or restore of the underlying PVC data based on the spec.',
    ],
    github: 'https://github.com/r4rajat/backstore',
  },
  {
    id: 'url-shortener',
    title: 'URL Shortener Backend',
    filters: ['python'],
    tech: ['Python 3', 'FastAPI', 'MongoDB', 'Memcached', 'Docker', 'Kubernetes'],
    blurb:
      'A FastAPI service that turns long URLs into short ones, with caching for hot reads.',
    body: [
      'A FastAPI-based URL shortening service. Takes a long URL and returns a short one.',
      'Uses MongoDB for permanent key-value storage and Memcached for cache-tier reads — fast lookups for the most active short links.',
    ],
    github: 'https://github.com/r4rajat/URL_Shortner_Backend',
  },
  {
    id: 'netpolmgr',
    title: 'Netpolmgr',
    filters: ['golang'],
    tech: ['Golang', 'Operator-go', 'Docker', 'Kubernetes'],
    blurb:
      'A Kubernetes validating webhook that protects pod labels referenced by network policies.',
    body: [
      'Netpolmgr is a custom Kubernetes validating admission webhook written in Go. It guards pod labels: if a label appears in any active network policy, edits to that label are rejected.',
      'Prevents accidental traffic-policy drift caused by routine label changes.',
    ],
    github: 'https://github.com/r4rajat/netpolmgr',
  },
  {
    id: 'robot-framework-demo',
    title: 'Robot Framework Demo',
    filters: ['rpa'],
    tech: ['Python', 'Selenium', 'Robot Framework'],
    blurb:
      'Self-learning notebook for Robot Framework — patterns, keywords, and RPA examples.',
    body: [
      'A growing collection of Robot Framework experiments and patterns for RPA, layered on top of Selenium and Python.',
      'Covers locator strategies, custom keywords, and end-to-end browser automation flows.',
    ],
    github: 'https://github.com/r4rajat/robot-framework-demo',
  },
];
