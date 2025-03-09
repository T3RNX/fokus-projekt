namespace BDogs.Services
{
    public class ImageService
    {
        private readonly string _imageDirectory;
        private readonly ILogger<ImageService> _logger;

        public ImageService(IWebHostEnvironment env, ILogger<ImageService> logger)
        {
            _imageDirectory = Path.Combine(env.ContentRootPath, "Images");
            _logger = logger;

            if (!Directory.Exists(_imageDirectory))
            {
                Directory.CreateDirectory(_imageDirectory);
            }
        }

        public string GetImageDirectory() => _imageDirectory;

        public async Task<string> SaveImageAsync(IFormFile file)
        {
            try
            {
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(_imageDirectory, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                return fileName;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving image");
                throw;
            }
        }

        public void DeleteImage(string fileName)
        {
            try
            {
                var filePath = Path.Combine(_imageDirectory, fileName);
                if (File.Exists(filePath))
                {
                    File.Delete(filePath);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting image");
                throw;
            }
        }

        public bool ValidateImage(IFormFile file)
        {
            // Define allowed file types and max size
            var allowedTypes = new[] { "image/jpeg", "image/png", "image/gif" };
            var maxSize = 5 * 1024 * 1024; // 5MB

            return allowedTypes.Contains(file.ContentType.ToLower()) && file.Length <= maxSize;
        }
    }
}