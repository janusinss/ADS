// Enhanced app.js with all new features
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all data loading
    loadProfile();
    loadSkills();
    loadProjects();
    loadHobbies();
    loadEducation();
    loadCertifications();
    loadExperience();
    loadAchievements();
    loadPortfolioStats();
    setupContactForm();

    // Set footer year
    document.getElementById('footer-year').textContent = new Date().getFullYear();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});

/**
 * Loads profile data from the API and renders it.
 */
async function loadProfile() {
    try {
        const response = await fetch('./api/profile_api.php');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const profile = await response.json();
        renderProfile(profile);
    } catch (error) {
        console.error('Error loading profile:', error);
        document.getElementById('profile-content').innerHTML = 
            '<p class="text-red-400">Error loading profile data.</p>';
    }
}

/**
 * Renders the profile data into the 'about' section.
 */
function renderProfile(profile) {
    const profileContainer = document.getElementById('profile-content');
    profileContainer.innerHTML = `
        <div class="order-2 md:order-1">
            <h1 class="text-5xl font-bold mb-4">${profile.full_name}</h1>
            <h2 class="text-3xl font-light text-cyan-400 mb-6">${profile.professional_title}</h2>
            <p class="text-lg text-gray-300 mb-8">${profile.bio}</p>
            <div class="flex flex-wrap gap-4">
                <a href="#contact" class="btn-primary">Contact Me</a>
                <a href="${profile.facebook_url}" target="_blank" rel="noopener noreferrer" class="btn-link">
                    <i data-lucide="facebook"></i>Facebook
                </a>
            </div>
            <div class="mt-8 space-y-2 text-gray-300">
                <div class="flex items-center gap-3">
                    <i data-lucide="mail" class="text-cyan-400"></i>
                    <span>${profile.email}</span>
                </div>
                <div class="flex items-center gap-3">
                    <i data-lucide="phone" class="text-cyan-400"></i>
                    <span>${profile.phone}</span>
                </div>
            </div>
        </div>
        <div class="order-1 md:order-2 flex justify-center items-center">
            <img src="${profile.profile_photo_url}" alt="${profile.full_name}" 
                 class="w-64 h-64 md:w-96 md:h-96 rounded-full object-cover border-4 border-cyan-500 shadow-lg shadow-cyan-500/20">
        </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * Loads skills data from the API and renders it.
 */
async function loadSkills() {
    try {
        const response = await fetch('./api/skills_api.php');
        if (!response.ok) throw new Error('Network response was not ok');
        const skills = await response.json();
        renderSkills(skills);
    } catch (error) {
        console.error('Error loading skills:', error);
        document.getElementById('skills-grid').innerHTML = 
            '<p class="text-red-400">Error loading skills data.</p>';
    }
}

/**
 * Renders skills into a grid.
 */
function renderSkills(skills) {
    const skillsGrid = document.getElementById('skills-grid');
    if (skills.length === 0) {
        skillsGrid.innerHTML = '<p>No skills listed yet.</p>';
        return;
    }

    skillsGrid.innerHTML = skills.map(skill => `
        <div class="card-glass text-center p-6">
            <h3 class="text-xl font-bold mb-2">${skill.name}</h3>
            <p class="text-sm text-cyan-400 mb-4">${skill.category_name}</p>
            <div class="w-full bg-gray-700 rounded-full h-2.5">
                <div class="bg-cyan-500 h-2.5 rounded-full" style="width: ${skill.proficiency}%"></div>
            </div>
            <span class="text-xs font-medium text-gray-300 mt-2 block">${skill.proficiency}% Proficient</span>
        </div>
    `).join('');
}

/**
 * Loads projects data from the API and renders it.
 */
async function loadProjects() {
    try {
        const response = await fetch('./api/projects_api.php');
        if (!response.ok) throw new Error('Network response was not ok');
        const projects = await response.json();
        renderProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-grid').innerHTML = 
            '<p class="text-red-400">Error loading projects data.</p>';
    }
}

/**
 * Renders projects into a grid.
 */
function renderProjects(projects) {
    const projectsGrid = document.getElementById('projects-grid');
    if (projects.length === 0) {
        projectsGrid.innerHTML = '<p>No projects listed yet.</p>';
        return;
    }

    projectsGrid.innerHTML = projects.map(project => `
        <div class="card-glass overflow-hidden flex flex-col">
            <img src="${project.image_url}" alt="${project.title}" class="w-full h-48 object-cover">
            <div class="p-6 flex flex-col flex-grow">
                <h3 class="text-xl font-bold mb-2">${project.title}</h3>
                <p class="text-gray-300 text-sm mb-4 flex-grow">${project.description}</p>
                <div class="flex space-x-4 mt-auto">
                    <a href="${project.project_url}" target="_blank" rel="noopener noreferrer" class="btn-link">
                        <i data-lucide="external-link" class="w-4 h-4"></i>Live Demo
                    </a>
                    <a href="${project.repo_url}" target="_blank" rel="noopener noreferrer" class="btn-link">
                        <i data-lucide="github" class="w-4 h-4"></i>Repo
                    </a>
                </div>
            </div>
        </div>
    `).join('');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * Loads hobbies data from the API and renders it.
 */
async function loadHobbies() {
    try {
        const response = await fetch('./api/hobbies_api.php');
        if (!response.ok) throw new Error('Network response was not ok');
        const hobbies = await response.json();
        renderHobbies(hobbies);
    } catch (error) {
        console.error('Error loading hobbies:', error);
        document.getElementById('hobbies-list').innerHTML = 
            '<p class="text-red-400">Error loading hobbies data.</p>';
    }
}

/**
 * Renders hobbies into a list.
 */
function renderHobbies(hobbies) {
    const hobbiesList = document.getElementById('hobbies-list');
    if (hobbies.length === 0) {
        hobbiesList.innerHTML = '<p>No hobbies listed yet.</p>';
        return;
    }

    hobbiesList.innerHTML = hobbies.map(hobby => `
        <div class="card-glass p-4">
            <h3 class="text-lg font-semibold">${hobby.name}</h3>
        </div>
    `).join('');
}

/**
 * NEW: Load Education data
 */
async function loadEducation() {
    try {
        const response = await fetch('./api/education_api.php');
        if (!response.ok) throw new Error('Network response was not ok');
        const education = await response.json();
        renderEducation(education);
    } catch (error) {
        console.error('Error loading education:', error);
        document.getElementById('education-list').innerHTML = 
            '<p class="text-red-400">Error loading education data.</p>';
    }
}

/**
 * Render Education
 */
function renderEducation(educationList) {
    const container = document.getElementById('education-list');
    if (educationList.length === 0) {
        container.innerHTML = '<p>No education records yet.</p>';
        return;
    }

    container.innerHTML = educationList.map(edu => `
        <div class="card-glass p-6">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h3 class="text-xl font-bold">${edu.degree}</h3>
                    <p class="text-cyan-400">${edu.institution}</p>
                </div>
                ${edu.is_current == 1 ? '<span class="text-xs bg-cyan-500 text-gray-900 px-3 py-1 rounded-full font-bold">Current</span>' : ''}
            </div>
            ${edu.field_of_study ? `<p class="text-gray-300 mb-2"><strong>Field:</strong> ${edu.field_of_study}</p>` : ''}
            <p class="text-gray-400 text-sm mb-2">
                <i data-lucide="calendar" class="w-4 h-4 inline"></i>
                ${formatDate(edu.start_date)} - ${edu.end_date ? formatDate(edu.end_date) : 'Present'}
            </p>
            ${edu.location ? `<p class="text-gray-400 text-sm mb-2"><i data-lucide="map-pin" class="w-4 h-4 inline"></i> ${edu.location}</p>` : ''}
            ${edu.grade ? `<p class="text-gray-300 text-sm"><strong>Grade:</strong> ${edu.grade}</p>` : ''}
            ${edu.description ? `<p class="text-gray-300 text-sm mt-3">${edu.description}</p>` : ''}
        </div>
    `).join('');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * NEW: Load Certifications
 */
async function loadCertifications() {
    try {
        const response = await fetch('./api/certifications_api.php');
        if (!response.ok) throw new Error('Network response was not ok');
        const certs = await response.json();
        renderCertifications(certs);
    } catch (error) {
        console.error('Error loading certifications:', error);
        document.getElementById('certifications-grid').innerHTML = 
            '<p class="text-red-400">Error loading certifications data.</p>';
    }
}

/**
 * Render Certifications
 */
function renderCertifications(certs) {
    const container = document.getElementById('certifications-grid');
    if (certs.length === 0) {
        container.innerHTML = '<p>No certifications yet.</p>';
        return;
    }

    container.innerHTML = certs.map(cert => {
        const isExpired = cert.expiry_date && new Date(cert.expiry_date) < new Date();
        return `
        <div class="card-glass p-6">
            <div class="flex justify-between items-start mb-3">
                <h3 class="text-lg font-bold">${cert.title}</h3>
                ${isExpired ? '<span class="text-xs bg-red-500 text-white px-2 py-1 rounded">Expired</span>' : 
                  '<span class="text-xs bg-green-500 text-white px-2 py-1 rounded">Active</span>'}
            </div>
            <p class="text-cyan-400 mb-2">${cert.issuing_organization}</p>
            <p class="text-gray-400 text-sm mb-2">
                <i data-lucide="calendar" class="w-4 h-4 inline"></i>
                Issued: ${formatDate(cert.issue_date)}
            </p>
            ${cert.expiry_date ? `<p class="text-gray-400 text-sm mb-2">Expires: ${formatDate(cert.expiry_date)}</p>` : ''}
            ${cert.credential_url ? `<a href="${cert.credential_url}" target="_blank" class="text-cyan-400 text-sm hover:underline">View Credential</a>` : ''}
        </div>
    `}).join('');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * NEW: Load Experience
 */
async function loadExperience() {
    try {
        const response = await fetch('./api/experience_api.php?duration=true');
        if (!response.ok) throw new Error('Network response was not ok');
        const experiences = await response.json();
        renderExperience(experiences);
    } catch (error) {
        console.error('Error loading experience:', error);
        document.getElementById('experience-list').innerHTML = 
            '<p class="text-red-400">Error loading experience data.</p>';
    }
}

/**
 * Render Experience
 */
function renderExperience(experiences) {
    const container = document.getElementById('experience-list');
    if (experiences.length === 0) {
        container.innerHTML = '<p>No work experience yet.</p>';
        return;
    }

    container.innerHTML = experiences.map(exp => `
        <div class="card-glass p-6">
            <div class="flex justify-between items-start mb-3">
                <div>
                    <h3 class="text-xl font-bold">${exp.position}</h3>
                    <p class="text-cyan-400">${exp.company}</p>
                </div>
                ${exp.is_current == 1 ? '<span class="text-xs bg-cyan-500 text-gray-900 px-3 py-1 rounded-full font-bold">Current</span>' : ''}
            </div>
            <div class="flex flex-wrap gap-2 mb-3">
                <span class="text-xs bg-gray-700 px-3 py-1 rounded-full">${exp.employment_type}</span>
                ${exp.location ? `<span class="text-xs bg-gray-700 px-3 py-1 rounded-full"><i data-lucide="map-pin" class="w-3 h-3 inline"></i> ${exp.location}</span>` : ''}
            </div>
            <p class="text-gray-400 text-sm mb-2">
                <i data-lucide="calendar" class="w-4 h-4 inline"></i>
                ${formatDate(exp.start_date)} - ${exp.end_date ? formatDate(exp.end_date) : 'Present'}
                ${exp.duration_text ? ` (${exp.duration_text})` : ''}
            </p>
            ${exp.description ? `<p class="text-gray-300 text-sm mt-3">${exp.description}</p>` : ''}
        </div>
    `).join('');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * NEW: Load Achievements
 */
async function loadAchievements() {
    try {
        const response = await fetch('./api/achievements_api.php');
        if (!response.ok) throw new Error('Network response was not ok');
        const achievements = await response.json();
        renderAchievements(achievements);
    } catch (error) {
        console.error('Error loading achievements:', error);
        document.getElementById('achievements-grid').innerHTML = 
            '<p class="text-red-400">Error loading achievements data.</p>';
    }
}

/**
 * Render Achievements
 */
function renderAchievements(achievements) {
    const container = document.getElementById('achievements-grid');
    if (achievements.length === 0) {
        container.innerHTML = '<p>No achievements yet.</p>';
        return;
    }

    const categoryIcons = {
        'award': 'trophy',
        'recognition': 'star',
        'competition': 'target',
        'publication': 'book-open',
        'other': 'award'
    };

    container.innerHTML = achievements.map(ach => `
        <div class="card-glass p-6">
            <div class="flex items-start gap-4">
                <div class="text-cyan-400 mt-1">
                    <i data-lucide="${categoryIcons[ach.category] || 'award'}" class="w-6 h-6"></i>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-bold mb-1">${ach.title}</h3>
                    <p class="text-sm text-cyan-400 mb-2">${ach.category}</p>
                    ${ach.issuing_organization ? `<p class="text-gray-400 text-sm mb-2">${ach.issuing_organization}</p>` : ''}
                    <p class="text-gray-400 text-sm mb-2">
                        <i data-lucide="calendar" class="w-4 h-4 inline"></i>
                        ${formatDate(ach.date_achieved)}
                    </p>
                    ${ach.description ? `<p class="text-gray-300 text-sm">${ach.description}</p>` : ''}
                </div>
            </div>
        </div>
    `).join('');
    if (typeof lucide !== 'undefined') lucide.createIcons();
}

/**
 * NEW: Load Portfolio Statistics (Advanced SQL demonstration)
 */
async function loadPortfolioStats() {
    try {
        const response = await fetch('./api/portfolio_stats_api.php');
        if (!response.ok) return; // Optional feature
        const stats = await response.json();
        renderPortfolioStats(stats);
    } catch (error) {
        console.error('Error loading stats:', error);
        // Stats are optional, don't show error
    }
}

/**
 * Render Portfolio Statistics
 */
function renderPortfolioStats(stats) {
    const container = document.getElementById('portfolio-stats');
    if (!container) return;

    const overview = stats.overview;
    container.innerHTML = `
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div class="card-glass p-4 text-center">
                <div class="text-3xl font-bold text-cyan-400">${overview.total_skills || 0}</div>
                <div class="text-sm text-gray-400">Skills</div>
            </div>
            <div class="card-glass p-4 text-center">
                <div class="text-3xl font-bold text-cyan-400">${overview.completed_projects || 0}</div>
                <div class="text-sm text-gray-400">Projects</div>
            </div>
            <div class="card-glass p-4 text-center">
                <div class="text-3xl font-bold text-cyan-400">${overview.total_certifications || 0}</div>
                <div class="text-sm text-gray-400">Certifications</div>
            </div>
            <div class="card-glass p-4 text-center">
                <div class="text-3xl font-bold text-cyan-400">${overview.total_achievements || 0}</div>
                <div class="text-sm text-gray-400">Achievements</div>
            </div>
        </div>
    `;
}

/**
 * Helper function to format dates
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}

/**
 * Sets up the event listener for the contact form.
 */
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const submitButton = document.getElementById('contact-submit-btn');
    const formMessage = document.getElementById('form-message');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        formMessage.classList.add('hidden');

        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('./api/contacts_api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.status === 201) {
                formMessage.textContent = result.message;
                formMessage.className = 'p-4 rounded-lg bg-green-900 text-green-300';
                form.reset();
            } else {
                throw new Error(result.message || 'An unknown error occurred.');
            }
        } catch (error) {
            formMessage.textContent = error.message;
            formMessage.className = 'p-4 rounded-lg bg-red-900 text-red-300';
        } finally {
            formMessage.classList.remove('hidden');
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    });
}