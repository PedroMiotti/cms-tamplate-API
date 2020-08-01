-- MySQL Script generated by MySQL Workbench
-- qua 08 jul 2020 17:49:56
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema cms
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema cms
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `cms` ;
USE `cms` ;

-- -----------------------------------------------------
-- Table `cms`.`perfil`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms`.`perfil` (
  `perf_id` INT NOT NULL,
  `perf_nome` VARCHAR(45) NULL,
  PRIMARY KEY (`perf_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cms`.`setor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms`.`setor` (
  `setor_id` INT NOT NULL,
  `setor_nome` VARCHAR(45) NULL,
  PRIMARY KEY (`setor_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `cms`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms`.`usuario` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `user_login` VARCHAR(45) NULL,
  `user_nome` VARCHAR(100) NULL,
  `user_senha` VARCHAR(100) NULL,
  `perf_id` INT NULL,
  PRIMARY KEY (`user_id`),
  INDEX `perf_id_user_idx` (`perf_id` ASC) VISIBLE,
  CONSTRAINT `perf_id_user`
    FOREIGN KEY (`perf_id`)
    REFERENCES `cms`.`perfil` (`perf_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
