# Docker Tutorial for Banknote Price Checker

## What is Docker?
Docker is a platform that packages your application and all its dependencies into a standardized unit called a "container." Think of it like a lightweight, portable box that contains everything your app needs to run.

## Files Created for Docker

### 1. Dockerfile
This is the recipe that tells Docker how to build your container:
- Uses Node.js 18 Alpine (lightweight Linux image)
- Sets up the working directory
- Installs dependencies
- Copies your application code
- Runs your app

### 2. .dockerignore
Tells Docker which files to ignore when building:
- `node_modules` (will be installed fresh in container)
- `results` (output files)
- Git files and documentation

### 3. docker-compose.yml
Makes it easier to run and manage your container:
- Automatically mounts the results directory
- Sets environment variables
- Handles container lifecycle

## How to Use Docker

### Prerequisites
1. Install Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)
2. Start Docker Desktop
3. Make sure Docker is running (check system tray)

### Method 1: Using Docker Compose (Recommended)

**Build and run in one command:**
```bash
docker-compose up --build
```

**Run without rebuilding (if already built):**
```bash
docker-compose up
```

**Run in background:**
```bash
docker-compose up -d
```

**Stop the container:**
```bash
docker-compose down
```

### Method 2: Using Docker Commands Directly

**Build the container:**
```bash
docker build -t banknote-price-checker .
```

**Run the container:**
```bash
docker run --rm -v "C:\Users\MrMiles\Desktop\JS\banknote_price_checker\results:/app/results" banknote-price-checker
```

**Note:** Replace the path with your actual project path.

## What Happens When You Run the Container

1. **Build Phase:**
   - Downloads Node.js 18 Alpine image
   - Installs your npm dependencies
   - Copies your application code
   - Creates the results directory

2. **Run Phase:**
   - Executes `npm start` (which runs `node index.js`)
   - Your app fetches data from banknote.lv
   - Generates JSON and HTML files
   - Saves results to the mounted volume

3. **Output:**
   - Results appear in your local `results/` folder
   - Container automatically stops when the script finishes

## Useful Docker Commands

**List all containers:**
```bash
docker ps -a
```

**List all images:**
```bash
docker images
```

**Remove old containers:**
```bash
docker container prune
```

**Remove old images:**
```bash
docker image prune
```

**View container logs:**
```bash
docker logs <container_name>
```

## Troubleshooting

### Container won't start
- Make sure Docker Desktop is running
- Check if the port 3000 is available (if you add a web interface later)
- Verify your `config.json` file is valid

### Can't see results
- Check that the volume mount path is correct
- Ensure the `results/` directory exists in your project
- Look for any error messages in the container logs

### Permission issues
- On Windows, make sure Docker has access to your drive
- Try running Docker Desktop as administrator

## Benefits of Docker

1. **Consistency:** Same environment everywhere
2. **Isolation:** Your app runs in its own container
3. **Portability:** Easy to move between machines
4. **Dependencies:** All dependencies are included
5. **Versioning:** Easy to manage different versions

## Next Steps

You can now:
- Schedule the container to run automatically
- Add a web interface to view results
- Deploy to cloud platforms
- Share your containerized app with others

## Example: Running on a Schedule

To run your container daily at 9 AM, you could use Windows Task Scheduler:

1. Create a batch file (`run-docker.bat`):
```batch
cd /d "C:\Users\MrMiles\Desktop\JS\banknote_price_checker"
docker-compose up --build
```

2. Set up Windows Task Scheduler to run this batch file daily at 9 AM

Your banknote price checker is now fully containerized and ready to run anywhere! 🐳
