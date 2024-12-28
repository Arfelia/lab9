import './App.css';
import React, { useEffect, useState, useCallback, useMemo } from "react";

export default function App() {
  const allAnimalsUrl = 'all'; // Для отображения всех категорий

  const rabbitImages = useMemo(() => [
    { src: 'https://i.pinimg.com/736x/5a/ac/27/5aac274d2001f0b3afc6d9debb3e1889.jpg', caption: 'Зайчик 1' },
    { src: 'https://i.pinimg.com/736x/c9/b3/a9/c9b3a9359177b8461f328a16a36711d9.jpg', caption: 'Зайчик 2' },
    { src: 'https://i.pinimg.com/736x/5c/d4/0b/5cd40be716447955c5febac9961d27ab.jpg', caption: 'Зайчик 3' },
    { src: 'https://i.pinimg.com/736x/c6/28/db/c628db39f6e50a7871fda0455e836de8.jpg', caption: 'Зайчик 4' }
  ], []);

  const catImages = useMemo(() => [
    { src: 'https://i.pinimg.com/736x/12/d8/76/12d876e93ebc8269a994d434baf17d96.jpg', caption: 'Кот 1' },
    { src: 'https://i.pinimg.com/736x/1e/65/f9/1e65f9f75eb8f769d8710727f42cee54.jpg', caption: 'Кот 2' },
    { src: 'https://i.pinimg.com/736x/32/7a/d4/327ad462f47457f24a612160c86b76a4.jpg', caption: 'Кот 3' },
    { src: 'https://i.pinimg.com/736x/ab/7a/f6/ab7af68976df318685d2d942725f1a50.jpg', caption: 'Кот 4' }
  ], []);

  const chickImages = useMemo(() => [
    { src: 'https://i.pinimg.com/736x/ce/71/e7/ce71e7252fec587ea404b21087364b1f.jpg', caption: 'Цыплёнок 1' },
    { src: 'https://i.pinimg.com/736x/fd/3e/86/fd3e86317f9ef3114b43e08d1295a8f3.jpg', caption: 'Цыплёнок 2' }
  ], []);

  const [imgs, setImgs] = useState([]);
  const [category, setCategory] = useState(allAnimalsUrl);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const fetchImages = useCallback(() => {
    setError(null);
    try {
      let categoryImages = [];
      if (category === allAnimalsUrl) {
        // Объединяем все изображения
        categoryImages = [
          ...rabbitImages,
          ...catImages,
          ...chickImages
        ];
      } else if (category === "rabbits") {
        categoryImages = rabbitImages;
      } else if (category === "cats") {
        categoryImages = catImages;
      } else if (category === "chicks") {
        categoryImages = chickImages;
      }

      if (searchQuery) {
        categoryImages = categoryImages.filter(img => img.caption.toLowerCase().includes(searchQuery.toLowerCase()));
      }

      const startIndex = (currentPage - 1) * itemsPerPage;
      const currentImages = categoryImages.slice(startIndex, startIndex + itemsPerPage);
      setImgs(currentImages);
    } catch (error) {
      setError('Ошибка при загрузке изображений: ' + error.message);
    }
  }, [category, rabbitImages, catImages, chickImages, currentPage, searchQuery]);

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при смене категории
  };

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Сбрасываем на первую страницу при поиске
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = useMemo(() => {
    let totalImages = 0;
    if (category === allAnimalsUrl) {
      totalImages = rabbitImages.length + catImages.length + chickImages.length;
    } else if (category === "rabbits") {
      totalImages = rabbitImages.length;
    } else if (category === "cats") {
      totalImages = catImages.length;
    } else if (category === "chicks") {
      totalImages = chickImages.length;
    }

    return Math.ceil(totalImages / itemsPerPage);
  }, [category, rabbitImages, catImages, chickImages]);

  useEffect(() => {
    fetchImages();
  }, [category, currentPage, fetchImages]);

  return (
    <>
      <div className="container">
        <h1 className="title">...</h1>
        <div className="search-container">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchQueryChange}
            placeholder="Поиск по названию"
            style={{ textAlign: 'center', marginBottom: '20px' }}
          />
        </div>
        <div className="buttons-container">
          <button value={allAnimalsUrl} onClick={handleCategoryChange}>Все</button>
          <button value="rabbits" onClick={handleCategoryChange}>Зайчики</button>
          <button value="cats" onClick={handleCategoryChange}>Котики</button>
          <button value="chicks" onClick={handleCategoryChange}>Цыплята</button>
        </div>

        {error ? (
          <p className="error-message">{error}</p>
        ) : (
          <div className="images-container">
            {imgs.map((img, index) => (
              <div key={index} className="image-item">
                <img id={`img${index}`} width={250} height={250} src={img.src} alt={`animal ${index}`} />
                <p className="caption">{img.caption}</p>
              </div>
            ))}
          </div>
        )}

        <div className="pagination">
          <button onClick={() => handlePageChange(1)} disabled={currentPage === 1}>Первая</button>
          <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>Назад</button>
          <span>Страница {currentPage} из {totalPages}</span>
          <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>Вперед</button>
          <button onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages}>Последняя</button>
        </div>
      </div>
    </>
  );
}
