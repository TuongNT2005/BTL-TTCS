-- ========================================================
-- CLOTHING SHOP DATABASE INITIALIZATION SCRIPT
-- Generated for Docker Image Auto-run
-- ========================================================

CREATE DATABASE IF NOT EXISTS `clothing_shop` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `clothing_shop`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- ------------------------------------------------------
-- Component: clothing_shop_user.sql
-- ------------------------------------------------------
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: clothing_shop
-- ------------------------------------------------------
-- Server version	8.0.43

/*!50503 SET NAMES utf8 */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS user;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  id int NOT NULL AUTO_INCREMENT,
  username varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  email varchar(255) DEFAULT NULL,
  phone varchar(255) DEFAULT NULL,
  address varchar(255) DEFAULT NULL,
  avatar varchar(255) DEFAULT NULL,
  `status` enum('ACTIVE','PENDING') NOT NULL DEFAULT 'ACTIVE',
  coin bigint NOT NULL DEFAULT '0',
  `role` enum('ADMIN','USER') NOT NULL DEFAULT 'USER',
  PRIMARY KEY (id),
  UNIQUE KEY username (username),
  UNIQUE KEY email (email)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `user`
--

LOCK TABLES user WRITE;
/*!40000 ALTER TABLE user DISABLE KEYS */;
INSERT INTO user VALUES (1,'admin','123456','admin@example.com','0123456789','123 Đường ABC, TP.HCM','avatar_admin.jpg','ACTIVE',0,'USER'),(2,'user1','0018','user1@example.com','0987654321','456 Đường XYZ, Hà Nội','avatar_user1.jpg','ACTIVE',100,'USER'),(3,'saho33','$2a$10$yyiJnwRbYfseE62LBEa.Ou.eVetXiIgETYv.87Q1EW3BmAFcT8.GW','useremail@gmail.com','0000000','123','aaa','ACTIVE',426000,'USER'),(6,'saho333','$2a$10$oJrh53IsnEt3K9nYOsOPtejW4LX6RCkqov5ywT4YmXRCPJ8BlYGv.','useremail1774019887241@gmail.com','0000000','123','aaa','ACTIVE',0,'USER'),(7,'tohancau','$2a$10$qL.YO67HwvSsZg9b6b/yt./etvqwafWOz4zxAvWgYdcrNQDtPG08G','useremail1774151790235@gmail.com','0000000','123','user_1779597239904.jpg','ACTIVE',191000,'USER'),(8,'tohancauđá','$2a$10$B0RUqWQbL4c1lF7v0fRKt.TQDHJLCwCvjn.SoulNRy9lunq4uAcJK','useremail1774151803940@gmail.com','0000000','123','aaa','ACTIVE',0,'USER'),(9,'admin1','$2a$10$44sVpfHfc5BFBInWriYzXuY19lnNpNvBWV27Z8dKMtfOEMJlWUx.i','useremail1776605591929@gmail.com','0000000','123','aaa','ACTIVE',0,'ADMIN'),(10,'tendangnhap','$2a$10$tkpR65iKtH5m58eiwBZ/9ORpzi11aqJAYiRsCmGdQAPhcSazXyMqu','tendangnhap@gmail.com','0000000','123','aaa','ACTIVE',7000,'USER');
/*!40000 ALTER TABLE user ENABLE KEYS */;
UNLOCK TABLES;


-- Dump completed on 2026-05-24 16:33:11


-- ------------------------------------------------------
-- Component: clothing_shop_color.sql
-- ------------------------------------------------------
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: clothing_shop
-- ------------------------------------------------------
-- Server version	8.0.43

/*!50503 SET NAMES utf8 */;

--
-- Table structure for table `color`
--

DROP TABLE IF EXISTS color;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE color (
  id int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `color`
--

LOCK TABLES color WRITE;
/*!40000 ALTER TABLE color DISABLE KEYS */;
INSERT INTO color VALUES (1,'Đỏ'),(2,'Hồng cánh sen'),(3,'Xanh'),(4,'Trắng');
/*!40000 ALTER TABLE color ENABLE KEYS */;
UNLOCK TABLES;


-- Dump completed on 2026-05-24 16:33:12


-- ------------------------------------------------------
-- Component: clothing_shop_event.sql
-- ------------------------------------------------------
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: clothing_shop
-- ------------------------------------------------------
-- Server version	8.0.43

/*!50503 SET NAMES utf8 */;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS event;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `event` (
  id int NOT NULL AUTO_INCREMENT,
  title varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  image varchar(255) NOT NULL,
  discount int NOT NULL,
  startat date DEFAULT NULL,
  endat date DEFAULT NULL,
  PRIMARY KEY (id),
  CONSTRAINT event_chk_1 CHECK ((`discount` <= 30)),
  CONSTRAINT event_chk_dates CHECK ((`endat` > `startAt`))
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `event`
--

LOCK TABLES event WRITE;
/*!40000 ALTER TABLE event DISABLE KEYS */;
INSERT INTO event VALUES (1,'Black Friday Siêu Sale 2025','Giảm giá cực sốc lên đến 30% toàn bộ sản phẩm thời trang, giày dép và phụ kiện. Sự kiện chỉ diễn ra trong 3 ngày duy nhất! Đừng bỏ lỡ cơ hội săn deal ngon nhất năm.','event_1775379614730.jpg',30,'2025-11-28','2025-11-30'),(4,'sự kiện đã bị chỉnh sửa','Mô tả của sự kiện này...','event_1775379621444.jpg',20,'2026-05-22','2026-09-14'),(5,'Sự kiện đầu TIên thứ 3','AD thêm vào để test thôi ahihi!','event_1775379988380.jpg',10,'2026-03-14','2026-05-14'),(6,'Tôi tạo 1 sự kiện mới','Tôi đã nhập mô tả cho sự kiện mới','event_1775379997122.jpg',25,'2026-04-05','2026-04-06'),(7,'TIÊU ĐỀ','MÔ TẢ mới','event_1778338950087.jpg',20,'2026-05-10','2026-06-06'),(8,'abcd','mô tả','event_1778339313568.jpg',25,'2026-04-30','2026-06-01'),(9,'Tiêu đè là tiêu đề','Mô tả là mô tả','event_1778860392332.jpg',20,'2026-05-16','2026-05-31');
/*!40000 ALTER TABLE event ENABLE KEYS */;
UNLOCK TABLES;


-- Dump completed on 2026-05-24 16:33:12


-- ------------------------------------------------------
-- Component: clothing_shop_product.sql
-- ------------------------------------------------------
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: clothing_shop
-- ------------------------------------------------------
-- Server version	8.0.43

/*!50503 SET NAMES utf8 */;

--
-- Table structure for table `product`
--

DROP TABLE IF EXISTS product;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE product (
  id int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  image varchar(255) NOT NULL,
  category enum('PANTS','SHIRT','DRESS','SET','SPORTSWEAR') NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product`
--

LOCK TABLES product WRITE;
/*!40000 ALTER TABLE product DISABLE KEYS */;
INSERT INTO product VALUES (1,'Áo Sweater','Áo Sweater cao cấp, chất vải dày, ấm áp, phù hợp để mặc khi thời tiết chuyển lạnh.','product_1774969385716.webp','PANTS'),(2,'Áo thun tay ngắn NY','Áo thun trẻ trung, đăng động, chất vải thoán mát, thích hợp mặc đi chơi với bạn bè.','product_1774970939760.webp','PANTS'),(3,'Bộ đồ ngủ KiRame','Bộ đồ ngủ nhập khẩu từ Pháp. Thoáng mát, dễ chịu khi mặc.','product_1774971027541.jpg','SET'),(4,'Set quần áo Nam NamSum','Bộ quần áo nam cao cấp nhập khẩu từ Hàn Quốc. Trẻ trung, năng động.','product_1774971118347.webp','SET'),(5,'Áo dài Phương Nam','Sản phẩm áo dài của cty Phương Nam, chất liệu vải lụa mềm mại, tôn vinh vẻ đẹp người phụ nữ Việt.','product_1774971216713.jpg','DRESS'),(6,'PYHTON-112','test','product_1776603038858.jpg','PANTS'),(7,'test210','fsdfsdf','product_1774951810416.png','PANTS'),(8,'PYHTON-11','abcde','product_1774951960339.png','PANTS'),(9,'TuongNg123','abds','product_1775057282560.jpg','PANTS'),(10,'tên sản phâm,r','mô tả','product_1774962531797.png','PANTS'),(11,'test21','123123','product_1778770475210.jpg','PANTS'),(12,'Áo Boomber AR','Áo Boomer, chất vải dày dặn, ấm áp, dễ phối đồ đi chơi.','product_1775059407478.webp','SHIRT'),(13,'Tên sản phẩm là tên sản phẩm','mô tả là mô tả','','PANTS'),(14,'TEST PRODUCT','tets','product_1778340062662.png','PANTS'),(15,'sản phẩm để test','tớ test thôi','product_1779510833128.jpg','PANTS');
/*!40000 ALTER TABLE product ENABLE KEYS */;
UNLOCK TABLES;


-- Dump completed on 2026-05-24 16:33:12


-- ------------------------------------------------------
-- Component: clothing_shop_productvariant.sql
-- ------------------------------------------------------
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: clothing_shop
-- ------------------------------------------------------
-- Server version	8.0.43

/*!50503 SET NAMES utf8 */;

--
-- Table structure for table `productvariant`
--

DROP TABLE IF EXISTS productvariant;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE productvariant (
  id int NOT NULL AUTO_INCREMENT,
  productId int NOT NULL,
  importCost bigint NOT NULL,
  purchasePrice bigint NOT NULL,
  `status` enum('COMING','AVALIBLE','UNAVALIBLE') NOT NULL DEFAULT 'AVALIBLE',
  quantity bigint NOT NULL DEFAULT '0',
  image varchar(255) NOT NULL,
  colorId int NOT NULL,
  size enum('S','M','L','XL','XXL','XXXL') NOT NULL DEFAULT 'L',
  PRIMARY KEY (id),
  KEY productId (productId),
  KEY colorId (colorId),
  CONSTRAINT productvariant_ibfk_1 FOREIGN KEY (productId) REFERENCES product (id) ON DELETE CASCADE,
  CONSTRAINT productvariant_ibfk_2 FOREIGN KEY (colorId) REFERENCES color (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `productvariant`
--

LOCK TABLES productvariant WRITE;
/*!40000 ALTER TABLE productvariant DISABLE KEYS */;
INSERT INTO productvariant VALUES (1,1,100000,220000,'AVALIBLE',48,'productVariant_1775223295636.webp',1,'L'),(2,2,116000,200000,'AVALIBLE',50,'productVariant_1775223304322.webp',1,'L'),(3,2,100000,114000,'AVALIBLE',9,'productVariant_1775223312535.webp',3,'L'),(4,12,320000,410000,'AVALIBLE',10,'productVariant_1775223328336.webp',1,'XL'),(5,4,115000,132000,'AVALIBLE',6,'',4,'XL'),(6,4,120000,138000,'AVALIBLE',0,'',3,'XL'),(7,5,200000,229000,'AVALIBLE',43,'',1,'XL'),(8,3,98000,112000,'AVALIBLE',90,'',4,'XL'),(9,2,123000,141000,'AVALIBLE',122,'',1,'XL'),(10,3,150000,172000,'AVALIBLE',15,'',3,'XL'),(11,3,120000,138000,'AVALIBLE',12,'',4,'M'),(12,3,100000,114000,'AVALIBLE',10,'',3,'M'),(13,1,100000,114000,'AVALIBLE',1,'',1,'XL');
/*!40000 ALTER TABLE productvariant ENABLE KEYS */;
UNLOCK TABLES;


-- Dump completed on 2026-05-24 16:33:12


-- ------------------------------------------------------
-- Component: clothing_shop_orders.sql
-- ------------------------------------------------------
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: clothing_shop
-- ------------------------------------------------------
-- Server version	8.0.43

/*!50503 SET NAMES utf8 */;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS orders;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE orders (
  id int NOT NULL AUTO_INCREMENT,
  userId int NOT NULL,
  address varchar(255) NOT NULL,
  phone varchar(255) DEFAULT NULL,
  coinUsed bigint NOT NULL DEFAULT '0',
  createdAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  expriedAt datetime NOT NULL,
  paidAt datetime DEFAULT NULL,
  `status` enum('PENDING','PAID','CANCEL','EXPRIED','DELIVERIED') NOT NULL DEFAULT 'PENDING',
  PRIMARY KEY (id),
  KEY userId (userId),
  CONSTRAINT orders_ibfk_1 FOREIGN KEY (userId) REFERENCES `user` (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orders`
--

LOCK TABLES orders WRITE;
/*!40000 ALTER TABLE orders DISABLE KEYS */;
INSERT INTO orders VALUES (2,3,'123','0000000',0,'2026-03-07 14:04:08','2026-03-08 14:04:08',NULL,'EXPRIED'),(3,3,'123','0000000',0,'2026-03-09 03:25:42','2026-03-10 03:25:42',NULL,'CANCEL'),(4,3,'123','0000000',0,'2026-03-09 03:38:04','2026-03-10 03:38:04',NULL,'CANCEL'),(5,3,'123','0000000',0,'2026-03-14 12:36:15','2026-03-15 12:36:15',NULL,'CANCEL'),(6,3,'123','0000000',0,'2026-03-18 09:16:47','2026-03-22 23:59:59','2026-03-21 13:14:10','DELIVERIED'),(7,3,'123','0000000',0,'2026-03-18 10:06:23','2026-03-19 10:06:23',NULL,'PAID'),(8,7,'123','0000000',0,'2026-04-21 09:16:56','2026-04-22 09:16:56',NULL,'EXPRIED'),(9,7,'24/25 Phùng Khoang','09876123',14000,'2026-05-01 01:59:33','2026-05-02 01:59:33',NULL,'CANCEL'),(10,7,'123','0000000',0,'2026-05-01 08:33:50','2026-05-02 08:33:50',NULL,'CANCEL'),(11,7,'123','0000000',11000,'2026-05-01 08:37:35','2026-05-02 08:37:35','2026-05-01 09:45:32','PAID'),(12,7,'123','0000000',0,'2026-05-07 04:09:17','2026-05-08 04:09:17','2026-05-07 04:11:07','DELIVERIED'),(13,7,'123','0000000',0,'2026-05-09 01:13:36','2026-05-10 01:13:36','2026-05-09 01:15:44','DELIVERIED'),(14,7,'123','0000000',0,'2026-05-12 13:59:53','2026-05-13 13:59:53',NULL,'EXPRIED'),(15,10,'123','0000000',0,'2026-05-23 10:10:21','2026-05-24 10:10:21','2026-05-23 10:11:39','PAID');
/*!40000 ALTER TABLE orders ENABLE KEYS */;
UNLOCK TABLES;


-- Dump completed on 2026-05-24 16:33:11


-- ------------------------------------------------------
-- Component: clothing_shop_cartitem.sql
-- ------------------------------------------------------
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: clothing_shop
-- ------------------------------------------------------
-- Server version	8.0.43

/*!50503 SET NAMES utf8 */;

--
-- Table structure for table `cartitem`
--

DROP TABLE IF EXISTS cartitem;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE cartitem (
  id int NOT NULL AUTO_INCREMENT,
  userId int NOT NULL,
  productVariantId int NOT NULL,
  quantity int NOT NULL,
  PRIMARY KEY (id),
  KEY userId (userId),
  KEY productVariantId (productVariantId),
  CONSTRAINT cartitem_ibfk_1 FOREIGN KEY (userId) REFERENCES `user` (id) ON DELETE CASCADE,
  CONSTRAINT cartitem_ibfk_2 FOREIGN KEY (productVariantId) REFERENCES productvariant (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `cartitem`
--

LOCK TABLES cartitem WRITE;
/*!40000 ALTER TABLE cartitem DISABLE KEYS */;
INSERT INTO cartitem VALUES (9,3,1,1),(39,7,1,1),(41,7,9,1);
/*!40000 ALTER TABLE cartitem ENABLE KEYS */;
UNLOCK TABLES;


-- Dump completed on 2026-05-24 16:33:11


-- ------------------------------------------------------
-- Component: clothing_shop_comment.sql
-- ------------------------------------------------------
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: clothing_shop
-- ------------------------------------------------------
-- Server version	8.0.43

/*!50503 SET NAMES utf8 */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS comment;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  id int NOT NULL AUTO_INCREMENT,
  userid int NOT NULL,
  productId int NOT NULL,
  content varchar(255) DEFAULT NULL,
  star int NOT NULL,
  product_id int DEFAULT NULL,
  createdAt date NOT NULL DEFAULT (curdate()),
  PRIMARY KEY (id),
  KEY userid (userid),
  KEY productId (productId),
  CONSTRAINT comment_ibfk_1 FOREIGN KEY (userid) REFERENCES `user` (id) ON DELETE CASCADE,
  CONSTRAINT comment_ibfk_2 FOREIGN KEY (productId) REFERENCES product (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `comment`
--

LOCK TABLES comment WRITE;
/*!40000 ALTER TABLE comment DISABLE KEYS */;
INSERT INTO comment VALUES (4,3,1,'Sản phẩm tốt!',4,NULL,'2026-04-11'),(5,3,1,NULL,4,NULL,'2026-04-11'),(6,3,1,NULL,4,NULL,'2026-04-11'),(7,7,2,'Aó đẹp vl',4,NULL,'2026-04-20'),(8,7,1,'Tôi không thích sản phẩm này',2,NULL,'2026-04-20');
/*!40000 ALTER TABLE comment ENABLE KEYS */;
UNLOCK TABLES;


-- Dump completed on 2026-05-24 16:33:12


-- ------------------------------------------------------
-- Component: clothing_shop_importhistory.sql
-- ------------------------------------------------------
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: clothing_shop
-- ------------------------------------------------------
-- Server version	8.0.43

/*!50503 SET NAMES utf8 */;

--
-- Table structure for table `importhistory`
--

DROP TABLE IF EXISTS importhistory;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE importhistory (
  id int NOT NULL AUTO_INCREMENT,
  productVariantId int NOT NULL,
  quantity int NOT NULL,
  price bigint NOT NULL,
  importAt datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY productVariantId (productVariantId),
  CONSTRAINT importhistory_ibfk_1 FOREIGN KEY (productVariantId) REFERENCES productvariant (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `importhistory`
--

LOCK TABLES importhistory WRITE;
/*!40000 ALTER TABLE importhistory DISABLE KEYS */;
INSERT INTO importhistory VALUES (1,1,50,100000,'2026-03-02 21:31:18'),(2,2,30,120000,'2026-03-02 21:31:18'),(3,2,10,100000,'2026-03-14 15:07:39'),(4,2,10,100000,'2026-03-14 16:02:38'),(5,3,10,100000,'2026-03-21 12:45:54'),(6,4,10,345000,'2026-04-03 13:17:48'),(7,5,10,115000,'2026-04-03 14:41:42'),(8,1,6,100000,'2026-04-15 01:29:12'),(9,6,10,120000,'2026-04-22 00:46:54'),(10,7,44,200000,'2026-04-22 00:47:21'),(11,8,100,98000,'2026-04-22 00:47:52'),(12,9,123,123000,'2026-04-22 00:48:11'),(13,10,15,150000,'2026-04-22 00:48:53'),(14,11,12,120000,'2026-04-22 00:49:06'),(15,12,10,100000,'2026-04-24 13:53:58');
/*!40000 ALTER TABLE importhistory ENABLE KEYS */;
UNLOCK TABLES;


-- Dump completed on 2026-05-24 16:33:12


-- ------------------------------------------------------
-- Component: clothing_shop_orderitem.sql
-- ------------------------------------------------------
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: clothing_shop
-- ------------------------------------------------------
-- Server version	8.0.43

/*!50503 SET NAMES utf8 */;

--
-- Table structure for table `orderitem`
--

DROP TABLE IF EXISTS orderitem;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE orderitem (
  id int NOT NULL AUTO_INCREMENT,
  orderId int NOT NULL,
  productVariantId int NOT NULL,
  quantity int NOT NULL,
  price bigint NOT NULL,
  discount int NOT NULL DEFAULT '0',
  returned enum('FALSE','TRUE','PENDING') NOT NULL DEFAULT 'FALSE',
  PRIMARY KEY (id),
  KEY orderId (orderId),
  KEY productVariantId (productVariantId),
  CONSTRAINT orderitem_ibfk_1 FOREIGN KEY (orderId) REFERENCES orders (id) ON DELETE CASCADE,
  CONSTRAINT orderitem_ibfk_2 FOREIGN KEY (productVariantId) REFERENCES productvariant (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `orderitem`
--

LOCK TABLES orderitem WRITE;
/*!40000 ALTER TABLE orderitem DISABLE KEYS */;
INSERT INTO orderitem VALUES (3,2,1,1,150000,0,'PENDING'),(4,2,1,3,150000,0,'FALSE'),(5,3,1,2,150000,0,'FALSE'),(6,4,1,2,150000,0,'FALSE'),(7,4,2,5,180000,0,'FALSE'),(8,5,1,1,120000,20,'FALSE'),(9,6,1,1,120000,20,'FALSE'),(10,7,1,1,120000,20,'FALSE'),(11,8,1,1,210000,0,'FALSE'),(12,8,5,3,132000,0,'FALSE'),(13,9,3,1,114000,0,'FALSE'),(14,9,2,1,200000,0,'FALSE'),(15,10,1,1,220000,0,'FALSE'),(16,11,9,1,141000,0,'FALSE'),(17,12,8,10,112000,0,'FALSE'),(18,13,6,10,138000,0,'FALSE'),(19,13,4,1,360000,10,'FALSE'),(20,13,5,1,132000,0,'FALSE'),(21,14,7,1,229000,0,'FALSE'),(22,14,3,1,114000,0,'FALSE'),(23,15,1,1,154000,30,'FALSE');
/*!40000 ALTER TABLE orderitem ENABLE KEYS */;
UNLOCK TABLES;


-- Dump completed on 2026-05-24 16:33:12


-- ------------------------------------------------------
-- Component: clothing_shop_product_event.sql
-- ------------------------------------------------------
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: clothing_shop
-- ------------------------------------------------------
-- Server version	8.0.43

/*!50503 SET NAMES utf8 */;

--
-- Table structure for table `product_event`
--

DROP TABLE IF EXISTS product_event;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE product_event (
  productId int NOT NULL,
  eventId int NOT NULL,
  PRIMARY KEY (productId,eventId),
  KEY eventId (eventId),
  CONSTRAINT product_event_ibfk_1 FOREIGN KEY (productId) REFERENCES product (id) ON DELETE CASCADE,
  CONSTRAINT product_event_ibfk_2 FOREIGN KEY (eventId) REFERENCES `event` (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `product_event`
--

LOCK TABLES product_event WRITE;
/*!40000 ALTER TABLE product_event DISABLE KEYS */;
INSERT INTO product_event VALUES (1,1),(2,1),(14,1),(1,4),(2,4),(12,5),(1,7),(11,7);
/*!40000 ALTER TABLE product_event ENABLE KEYS */;
UNLOCK TABLES;


-- Dump completed on 2026-05-24 16:33:12


-- ------------------------------------------------------
-- Component: clothing_shop_refundrequest.sql
-- ------------------------------------------------------
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: clothing_shop
-- ------------------------------------------------------
-- Server version	8.0.43

/*!50503 SET NAMES utf8 */;

--
-- Table structure for table `refundrequest`
--

DROP TABLE IF EXISTS refundrequest;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE refundrequest (
  id int NOT NULL AUTO_INCREMENT,
  userid int NOT NULL,
  orderItemId int NOT NULL,
  reason varchar(255) DEFAULT NULL,
  image varchar(255) NOT NULL,
  createdat datetime(6) DEFAULT NULL,
  `status` enum('ACCEPTED','DONE','PENDING','REJECTED') DEFAULT NULL,
  quantity int NOT NULL DEFAULT '1',
  PRIMARY KEY (id),
  KEY userid (userid),
  KEY orderItemId (orderItemId),
  CONSTRAINT refundrequest_ibfk_1 FOREIGN KEY (userid) REFERENCES `user` (id) ON DELETE CASCADE,
  CONSTRAINT refundrequest_ibfk_2 FOREIGN KEY (orderItemId) REFERENCES orderitem (id) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `refundrequest`
--

LOCK TABLES refundrequest WRITE;
/*!40000 ALTER TABLE refundrequest DISABLE KEYS */;
INSERT INTO refundrequest VALUES (2,3,3,'Sản phẩm bị bẩn và rách :((','refund_1773394567236.png','2026-03-13 09:36:07.246661','ACCEPTED',1),(3,3,4,'Giao nhầm màu rùi!!','refund_1773394703271.png','2026-03-13 09:38:23.281229','DONE',1),(4,3,4,'Giao nhầm màu rùi!!','','2026-03-14 12:49:01.552329','ACCEPTED',1),(5,7,18,'Tôi ghét sản phẩm này','refund_1778384619835.jpg','2026-05-10 03:43:39.857238','PENDING',1);
/*!40000 ALTER TABLE refundrequest ENABLE KEYS */;
UNLOCK TABLES;


-- Dump completed on 2026-05-24 16:33:12


/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
